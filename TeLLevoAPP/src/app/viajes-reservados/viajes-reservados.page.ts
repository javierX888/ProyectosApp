import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-viajes-reservados',
  templateUrl: './viajes-reservados.page.html',
  styleUrls: ['./viajes-reservados.page.scss'],
})
export class ViajesReservadosPage implements OnInit {
  viajesReservados: any[] = [];
  viajesFiltrados: any[] = [];
  filtroEstado: string = 'todos';
  totalViajes: number = 0;
  totalGastado: number = 0;

  constructor(
    private router: Router,
    private viajeService: ViajeService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarViajesReservados();
  }

  ionViewWillEnter() {
    this.cargarViajesReservados();
  }

  async cargarViajesReservados() {
    const loading = await this.loadingController.create({
      message: 'Cargando viajes...'
    });
    await loading.present();

    try {
      const username = this.authService.getUsername();
      this.viajeService.getViajesReservados(username).subscribe(
        viajes => {
          this.viajesReservados = viajes;
          this.filtrarViajes();
          this.calcularEstadisticas();
          loading.dismiss();
        },
        error => {
          console.error('Error al cargar viajes:', error);
          this.mostrarToast('Error al cargar los viajes');
          loading.dismiss();
        }
      );
    } catch (error) {
      console.error('Error:', error);
      loading.dismiss();
    }
  }

  filtrarViajes() {
    if (this.filtroEstado === 'todos') {
      this.viajesFiltrados = [...this.viajesReservados];
    } else {
      this.viajesFiltrados = this.viajesReservados.filter(
        viaje => viaje.estado === this.filtroEstado
      );
    }
  }

  calcularEstadisticas() {
    this.totalViajes = this.viajesReservados.length;
    this.totalGastado = this.viajesReservados.reduce(
      (total, viaje) => total + viaje.precio, 
      0
    );
  }

  async cancelarReserva(viajeId: number) {
    const alert = await this.alertController.create({
      header: 'Cancelar Reserva',
      message: '¿Estás seguro que deseas cancelar esta reserva?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, cancelar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Cancelando reserva...'
            });
            await loading.present();

            try {
              const success = await this.viajeService.cancelarViaje(viajeId).toPromise();
              if (success) {
                await this.cargarViajesReservados();
                this.mostrarToast('Reserva cancelada exitosamente', 'success');
                this.notificarConductor(viajeId);
              } else {
                this.mostrarToast('Error al cancelar la reserva');
              }
            } catch (error) {
              console.error('Error al cancelar reserva:', error);
              this.mostrarToast('Error al cancelar la reserva');
            } finally {
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async verDetallesViaje(viaje: any) {
    const alert = await this.alertController.create({
      header: 'Detalles del Viaje',
      message: `
        <strong>Origen:</strong> ${viaje.origen}<br>
        <strong>Destino:</strong> ${viaje.destino}<br>
        <strong>Fecha:</strong> ${this.formatearFecha(viaje.fecha)}<br>
        <strong>Hora:</strong> ${viaje.hora}<br>
        <strong>Conductor:</strong> ${viaje.conductorNombre}<br>
        <strong>Patente:</strong> ${viaje.patente}<br>
        <strong>Precio:</strong> $${viaje.precio}<br>
        <strong>Estado:</strong> ${viaje.estado}
      `,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

  async contactarConductor(viaje: any) {
    // Implementar sistema de mensajería
    this.mostrarToast('Función de mensajería en desarrollo');
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'reservado':
        return 'warning';
      case 'aceptado':
        return 'success';
      case 'cancelado':
        return 'danger';
      default:
        return 'medium';
    }
  }

  async doRefresh(event: any) {
    try {
      await this.cargarViajesReservados();
    } finally {
      event.target.complete();
    }
  }

  private async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  private notificarConductor(viajeId: number) {
    // Implementar sistema de notificaciones
    console.log('Notificar al conductor del viaje:', viajeId);
  }

  private formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}