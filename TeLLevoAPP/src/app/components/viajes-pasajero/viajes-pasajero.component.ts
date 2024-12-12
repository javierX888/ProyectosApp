import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ViajeService } from '../../services/viaje.service';
import { AuthService } from '../../services/auth.service';
import { Viaje } from '../../interfaces/viaje.interface';

@Component({
  selector: 'app-viajes-pasajero',
  templateUrl: './viajes-pasajero.component.html',
  styleUrls: ['./viajes-pasajero.component.scss']
})
export class ViajesPasajeroComponent implements OnInit {
  @Input() viaje!: Viaje;
  isReserved: boolean = false;

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    if (!this.viaje) {
      console.error('No se proporcionó un viaje');
      return;
    }
    this.isReserved = this.viaje.estado === 'reservado';
  }

  async reservarViaje() {
    if (!this.viaje || this.isReserved) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Reserva',
      message: '¿Deseas reservar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, Reservar',
          handler: () => {
            const userId = this.authService.getUsername();
            this.viajeService.reservarViaje(this.viaje.id, userId).subscribe({
              next: () => {
                this.isReserved = true;
                this.presentToast('Viaje reservado exitosamente', 'success');
              },
              error: (error) => {
                console.error('Error al reservar:', error);
                this.presentToast('Error al reservar el viaje', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelarViaje() {
    if (!this.viaje || !this.isReserved) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: '¿Estás seguro que deseas cancelar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, Cancelar',
          handler: () => {
            this.viajeService.cancelarViaje(this.viaje.id).subscribe({
              next: () => {
                this.isReserved = false;
                this.presentToast('Viaje cancelado exitosamente', 'success');
              },
              error: (error: Error) => {
                console.error('Error al cancelar:', error);
                this.presentToast('Error al cancelar el viaje', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'disponible': 'primary',
      'reservado': 'warning',
      'aceptado': 'success',
      'cancelado': 'danger',
      'completado': 'success'
    };
    return colores[estado] || 'medium';
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}