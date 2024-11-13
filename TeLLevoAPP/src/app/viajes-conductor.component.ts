import { Component, Input } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-conductor',
  templateUrl: './viajes-conductor.component.html',
  styleUrls: ['./viajes-conductor.component.scss'],
})
export class ViajesConductorComponent {
  @Input() viajeId: number;

  constructor(
    private viajeService: ViajeService,
    private toastController: ToastController
  ) { }

  aceptarViaje() {
    this.viajeService.aceptarViaje(this.viajeId).subscribe(
      (success: boolean) => {
        if (success) {
          this.presentToast('Viaje aceptado exitosamente.', 'success');
        } else {
          this.presentToast('Error al aceptar el viaje.', 'danger');
        }
      },
      (error) => {
        console.error('Error al aceptar viaje:', error);
        this.presentToast('Error al aceptar el viaje.', 'danger');
      }
    );
  }

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