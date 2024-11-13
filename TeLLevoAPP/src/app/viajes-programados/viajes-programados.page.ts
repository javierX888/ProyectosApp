import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-programados',
  templateUrl: './viajes-programados.page.html',
  styleUrls: ['./viajes-programados.page.scss'],
})
export class ViajesProgramadosPage implements OnInit {
  disponiblesViajes: Viaje[] = [];
  reservadosViajes: Viaje[] = [];
  completadosViajes: Viaje[] = [];
  conductorNombre: string = '';

  constructor(
    private viajeService: ViajeService,
    public authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.conductorNombre = this.authService.getUsername();
    this.cargarViajesProgramados();
  }

  cargarViajesProgramados() {
    // Obtener viajes disponibles
    this.viajeService.getViajesDisponibles(this.conductorNombre).subscribe(
      (viajes: Viaje[]) => {
        this.disponiblesViajes = viajes;
      },
      (error) => {
        console.error('Error al cargar viajes disponibles:', error);
      }
    );

    // Obtener viajes reservados
    this.viajeService.getViajesReservados(this.conductorNombre).subscribe(
      (viajes: Viaje[]) => {
        this.reservadosViajes = viajes;
      },
      (error) => {
        console.error('Error al cargar viajes reservados:', error);
      }
    );

    // Obtener viajes completados (opcional)
    this.viajeService.getViajesCompletados(this.conductorNombre).subscribe(
      (viajes: Viaje[]) => {
        this.completadosViajes = viajes;
      },
      (error) => {
        console.error('Error al cargar viajes completados:', error);
      }
    );
  }

  // Método para aceptar un viaje reservado
  async aceptarViaje(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Aceptación',
      message: `¿Estás seguro de aceptar el viaje a ${viaje.destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.viajeService.aceptarViaje(viaje.id).subscribe(
              (success: boolean) => {
                if (success) {
                  this.presentToast('Viaje aceptado exitosamente.', 'success');
                  this.cargarViajesProgramados(); // Actualizar la lista
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
        }
      ]
    });

    await alert.present();
  }

  // Método para cancelar un viaje reservado
  async cancelarViaje(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: `¿Estás seguro de cancelar el viaje a ${viaje.destino}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cancelar Viaje',
          handler: () => {
            this.viajeService.cancelarViaje(viaje.id).subscribe(
              (success: boolean) => {
                if (success) {
                  this.presentToast('Viaje cancelado exitosamente.', 'success');
                  this.cargarViajesProgramados(); // Actualizar la lista
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
        }
      ]
    });

    await alert.present();
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
