import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViajeService, Viaje } from '../services/viaje.service';

@Component({
  selector: 'app-pasajero-dashboard',
  templateUrl: './pasajero-dashboard.page.html',
  styleUrls: ['./pasajero-dashboard.page.scss'],
})
export class PasajeroDashboardPage implements OnInit {
  nombreUsuario: string = '';
  viajesReservados: number = 0;
  viajesCompletados: number = 0;
  proximosViajes: Viaje[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.cargarEstadisticas();
    this.cargarProximosViajes();
  }

  ionViewWillEnter() {
    this.cargarEstadisticas();
    this.cargarProximosViajes();
  }

  cargarDatosUsuario() {
    this.nombreUsuario = this.authService.getNombre();
  }

  cargarEstadisticas() {
    // Implementar un método en ViajeService para obtener estadísticas
    // Ejemplo:
    this.viajeService.getEstadisticasPasajero(this.authService.getUsername()).then(stats => {
      this.viajesReservados = stats.viajesReservados;
      this.viajesCompletados = stats.viajesCompletados;
    }).catch(error => {
      console.error('Error cargando estadísticas:', error);
    });
  }

  cargarProximosViajes() {
    this.viajeService.getViajesReservados(this.authService.getUsername()).subscribe((viajes: Viaje[]) => {
      this.proximosViajes = viajes.filter(viaje => new Date(viaje.fecha) > new Date());
    }, error => {
      console.error('Error cargando próximos viajes:', error);
    });
  }

  buscarViaje() {
    this.router.navigate(['/buscar-viaje']);
  }

  verViajesReservados() {
    this.router.navigate(['/viajes-reservados']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
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

  // Método para refrescar datos
  async doRefresh(event: any) {
    try {
      await Promise.all([
        this.cargarEstadisticas(),
        this.cargarProximosViajes()
      ]);
    } finally {
      if (event && event.target) {
        event.target.complete();
      }
    }
  }

  // Método para formatear fecha
  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para obtener color según estado
  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'reservado':
        return 'warning';
      case 'aceptado':
        return 'primary';
      case 'completado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }
}
