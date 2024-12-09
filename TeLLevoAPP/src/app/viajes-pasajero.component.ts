import { Component, Input } from '@angular/core';
import { ViajeService } from './services/viaje.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-pasajero',
  templateUrl: './viajes-pasajero.component.html',
  styleUrls: ['./viajes-pasajero.component.scss'],
})
export class ViajesPasajeroComponent {
  @Input() viajeId: number = 0;

  constructor(
    private viajeService: ViajeService,
    private toastController: ToastController
  ) { }

  cancelarViaje() {
    this.viajeService.cancelarViaje(this.viajeId).subscribe(
      (success: boolean) => {
        if (success) {
          this.presentToast('Viaje cancelado exitosamente.', 'success');
        } else {
          this.presentToast('Error al cancelar el viaje.', 'danger');
        }
      },
      (error) => {
        console.error('Error al cancelar viaje:', error);
        this.presentToast('Error al cancelar el viaje.', 'danger');
      }
    );
  }

  // Método para mostrar un toast
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}