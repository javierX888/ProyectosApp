import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViajeService } from '../services/viaje.service';
import { Viaje } from '../interfaces/viaje.interface';

interface EstadisticasConductor {
  viajesActivos: number;
  totalPasajeros: number;
}

@Component({
  selector: 'app-conductor-dashboard',
  templateUrl: './conductor-dashboard.page.html',
  styleUrls: ['./conductor-dashboard.page.scss'],
})
export class ConductorDashboardPage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';
  profileImage: string | null = null;
  viajesActivos: number = 0;
  totalPasajeros: number = 0;
  showAddVehicleForm: boolean = false;
  newVehicle: any = {
    modeloVehiculo: '',
    patente: '',
    licencia: ''
  };
  vehicles: any[] = [];
  viajesProgramados: Viaje[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarVehiculos();
    await this.cargarEstadisticas();
    await this.cargarViajesProgramados();
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  async cargarEstadisticas() {
    const username = this.authService.getUsername();
    this.viajeService.getEstadisticasConductor(username)
      .subscribe((estadisticas: EstadisticasConductor) => {
        this.viajesActivos = estadisticas.viajesActivos;
        this.totalPasajeros = estadisticas.totalPasajeros;
      });
  }

  async cargarViajesProgramados() {
    const username = this.authService.getUsername();
    this.viajeService.getViajesProgramados(username)
      .subscribe((viajes: Viaje[]) => {
        this.viajesProgramados = viajes;
      });
  }

  async cargarDatosUsuario() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.nombreUsuario = user.nombre;
      this.email = user.email;
    }
  }

  async cargarVehiculos() {
    // Implementar lógica para cargar vehículos
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
          role: 'confirm'
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    
    if (role === 'confirm') {
      await this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
  }

  async addVehicle() {
    const loading = await this.loadingController.create({
      message: 'Agregando vehículo...'
    });
    await loading.present();

    try {
      // Implementar lógica para agregar vehículo
      this.showAddVehicleForm = false;
      this.newVehicle = {
        modeloVehiculo: '',
        patente: '',
        licencia: ''
      };
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.error('Error al agregar vehículo:', error);
    }
  }

  programarViaje() {
    this.router.navigate(['/programar-viaje']);
  }

  verTodosLosViajes() {
    this.router.navigate(['/viajes-programados']);
  }

  mostrarPerfil() {
    this.router.navigate(['/perfil']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  verViajesProgramados() {
    this.router.navigate(['/viajes-programados']);
  }
}