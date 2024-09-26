import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-reservados',
  templateUrl: './viajes-reservados.page.html',
  styleUrls: ['./viajes-reservados.page.scss'],
})
export class ViajesReservadosPage implements OnInit {
  viajesReservados: any[] = [];

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarViajesReservados();
  }

  cargarViajesReservados() {
    const username = this.authService.getUsername();
    this.viajeService.getViajesReservados(username).subscribe(
      viajes => this.viajesReservados = viajes
    );
  }

  async cancelarReserva(viajeId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmar cancelación',
      message: '¿Estás seguro de que quieres cancelar este viaje?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        }, {
          text: 'Sí',
          handler: () => {
            this.viajeService.cancelarViaje(viajeId).subscribe(
              success => {
                if (success) {
                  this.mostrarToast('Viaje cancelado con éxito', 'success');
                  this.cargarViajesReservados();
                  // Aquí puedes agregar la lógica para notificar al conductor
                  this.notificarConductor(viajeId);
                } else {
                  this.mostrarToast('Error al cancelar el viaje', 'danger');
                }
              }
            );
          }
        }
      ]
    });
  
    await alert.present();
  }
  
  notificarConductor(viajeId: number) {
    // Implementa la lógica para notificar al conductor
    // Esto podría ser a través de un servicio de notificaciones o una alerta en la aplicación
    console.log(`Notificar al conductor que el viaje ${viajeId} ha sido cancelado`);
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}