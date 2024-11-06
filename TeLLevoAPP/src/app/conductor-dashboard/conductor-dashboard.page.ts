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
  nombreUsuario: string = '';
  viajesActivos: number = 0;
  totalPasajeros: number = 0;
  viajesProgramados: Viaje[] = [];
  perfilVisible: boolean = false; // Renombrado para evitar duplicación
  showAddVehicleForm: boolean = false;
  newVehicle: any = {
    modeloVehiculo: '',
    patente: '',
    licencia: ''
  };
  vehicles: any[] = [];

  constructor(
    private router: Router,
    public authService: AuthService, // Cambiado a public para acceso desde el template
    private viajeService: ViajeService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarEstadisticas();
    this.cargarViajesProgramados();
    this.vehicles = this.authService.getVehicles();
  }

  ionViewWillEnter() {
    this.cargarEstadisticas();
    this.cargarViajesProgramados();
    this.vehicles = this.authService.getVehicles();
  }

  cargarDatosUsuario() {
    this.nombreUsuario = this.authService.getNombre();
  }

  cargarEstadisticas() {
    this.viajeService.getEstadisticasConductor(this.authService.getUsername()).then(stats => {
      this.viajesActivos = stats.viajesActivos;
      this.totalPasajeros = stats.totalPasajeros;
    }).catch(error => {
      console.error('Error cargando estadísticas:', error);
    });
  }

  cargarViajesProgramados() {
    this.viajeService.getViajesProgramados(this.authService.getUsername()).subscribe((viajes: Viaje[]) => {
      this.viajesProgramados = viajes;
    }, error => {
      console.error('Error cargando viajes programados:', error);
    });
  }

  programarViaje() {
    this.router.navigate(['/programar-viaje']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  verViajesProgramados() {
    this.router.navigate(['/viajes-programados']);
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
            const loading = await this.loadingController.create({
              message: 'Cerrando sesión...'
            });
            await loading.present();

            try {
              this.authService.logout();
              await loading.dismiss();
              this.router.navigate(['/home'], { replaceUrl: true });
            } catch (error: any) {
              console.error('Error al cerrar sesión:', error);
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // Método para mostrar la sección de perfil
  mostrarPerfil() {
    this.perfilVisible = true;
  }

  // Método para ocultar la sección de perfil (opcional)
  ocultarPerfil() {
    this.perfilVisible = false;
  }

  // Método para alternar el formulario de agregar vehículo
  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
  }

  // Método para agregar un nuevo vehículo
  addVehicle() {
    if (this.newVehicle.modeloVehiculo && this.newVehicle.patente && this.newVehicle.licencia) {
      this.authService.addVehicle(this.newVehicle);
      this.vehicles = this.authService.getVehicles(); // Actualizar la lista de vehículos
      this.newVehicle = { modeloVehiculo: '', patente: '', licencia: '' };
      this.showAddVehicleForm = false;
      this.perfilVisible = true; // Mantener el perfil visible después de agregar
      // Opcional: mostrar un mensaje de éxito
    } else {
      // Opcional: mostrar un mensaje de error
      console.error('Por favor, completa todos los campos del vehículo.');
    }
  }

  // Método para refrescar datos (si lo necesitas)
  async doRefresh(event: any) {
    try {
      await Promise.all([
        this.cargarEstadisticas(),
        this.cargarViajesProgramados()
      ]);
    } finally {
      if (event && event.target) {
        event.target.complete();
      }
    }
  }
}
