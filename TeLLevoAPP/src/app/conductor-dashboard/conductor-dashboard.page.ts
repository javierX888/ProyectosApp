import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViajeService, Viaje } from '../services/viaje.service';

@Component({
  selector: 'app-conductor-dashboard',
  templateUrl: './conductor-dashboard.page.html',
  styleUrls: ['./conductor-dashboard.page.scss'],
})
export class ConductorDashboardPage implements OnInit {
  // Propiedades para el perfil
  nombreUsuario: string = '';
  email: string = '';
  profileImage: string | null = null;

  // Propiedades para estadísticas
  viajesActivos: number = 0;
  totalPasajeros: number = 0;

  // Propiedades para vehículos
  showAddVehicleForm: boolean = false;
  newVehicle: any = {
    modeloVehiculo: '',
    patente: '',
    licencia: ''
  };
  vehicles: any[] = [];

  // Propiedades para viajes
  viajesProgramados: Viaje[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ionViewWillEnter() {
    // Este método se ejecuta cada vez que la página se va a mostrar
    this.cargarDatosUsuario();
}

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarVehiculos();
    await this.cargarEstadisticas();
    await this.cargarViajesProgramados();
  }

  async cargarDatosUsuario() {
    try {
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        const token = await this.authService.getToken();
        if (token) {
          const payload = this.authService.decodeToken(token);
          if (payload) {
            this.nombreUsuario = payload.nombre || '';
            this.email = payload.email || '';
            console.log('Datos cargados desde token:', { nombre: this.nombreUsuario, email: this.email });
          }
        }
      } else {
        this.nombreUsuario = currentUser.nombre || '';
        this.email = currentUser.email || '';
        console.log('Datos cargados desde currentUser:', { nombre: this.nombreUsuario, email: this.email });
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      // Podríamos mostrar un mensaje al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar datos del usuario';
      // Aquí podrías mostrar un toast o alguna otra notificación
    }
  }

  async cargarVehiculos() {
    this.vehicles = await this.authService.getVehicles();
  }

  async cargarEstadisticas() {
    try {
      const stats = await this.viajeService.getEstadisticasConductor(this.authService.getUsername());
      this.viajesActivos = stats.viajesActivos;
      this.totalPasajeros = stats.totalPasajeros;
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  async cargarViajesProgramados() {
    try {
      const viajes = await this.viajeService.getViajesProgramados(this.authService.getUsername()).toPromise();
      // Aseguramos que siempre sea un array, incluso si la respuesta es null o undefined
      this.viajesProgramados = viajes || [];
      console.log('Viajes programados cargados:', this.viajesProgramados);
    } catch (error) {
      console.error('Error al cargar viajes programados:', error);
      // En caso de error, mantenemos el array vacío
      this.viajesProgramados = [];
      // Podríamos mostrar un mensaje al usuario si lo deseamos
    }
  }

  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
  }

  async addVehicle() {
    if (!this.newVehicle.modeloVehiculo || !this.newVehicle.patente || !this.newVehicle.licencia) {
      // Mostrar mensaje de error
      return;
    }

    try {
      await this.authService.addVehicle(this.newVehicle);
      await this.cargarVehiculos();
      this.showAddVehicleForm = false;
      this.newVehicle = {
        modeloVehiculo: '',
        patente: '',
        licencia: ''
      };
    } catch (error) {
      console.error('Error al agregar vehículo:', error);
    }
  }

  programarViaje() {
    this.router.navigate(['/programar-viaje']);
  }

  verTodosLosViajes() {
    this.router.navigate(['/viajes-programados']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  verViajesProgramados() {
    this.router.navigate(['/viajes-programados']);
  }

  mostrarPerfil() {
    // Por ahora solo recarga los datos del usuario
    this.cargarDatosUsuario();
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          }
        }
      ]
    });

    await alert.present();
  }
}