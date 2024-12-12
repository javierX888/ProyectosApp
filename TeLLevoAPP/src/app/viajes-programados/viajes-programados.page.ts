import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { Viaje } from '../interfaces/viaje.interface';

interface ErrorResponse {
  message: string;
  status: number;
}

@Component({
  selector: 'app-viajes-programados',
  templateUrl: './viajes-programados.page.html',
  styleUrls: ['./viajes-programados.page.scss'],
})
export class ViajesProgramadosPage implements OnInit {
  disponiblesViajes: Viaje[] = [];
  reservadosViajes: Viaje[] = [];
  completadosViajes: Viaje[] = [];
  viajesProgramados: Viaje[] = [];

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarViajesProgramados();
  }

  ionViewWillEnter() {
    this.cargarViajesProgramados();
  }

  cargarViajesProgramados(): void {
    const username = this.authService.getUsername();
    this.viajeService.getViajesProgramados(username).subscribe({
      next: (viajes: Viaje[]) => {
        this.viajesProgramados = viajes;
        this.clasificarViajes(viajes);
      },
      error: (error: ErrorResponse) => {
        console.error('Error al cargar viajes:', error);
        this.presentToast('Error al cargar viajes.', 'danger');
      }
    });
  }

  clasificarViajes(viajes: Viaje[]): void {
    this.disponiblesViajes = viajes.filter(v => v.estado === 'disponible');
    this.reservadosViajes = viajes.filter(v => v.estado === 'reservado');
    this.completadosViajes = viajes.filter(v => v.estado === 'completado');
  }

  async aceptarViaje(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Aceptación',
      message: '¿Estás seguro que deseas aceptar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.viajeService.aceptarViaje(viaje.id).subscribe({
              next: () => {
                this.presentToast('Viaje aceptado exitosamente', 'success');
                this.cargarViajesProgramados();
              },
              error: (error) => {
                console.error('Error al aceptar viaje:', error);
                this.presentToast('Error al aceptar el viaje', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelarViaje(viaje: Viaje) {
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
            this.viajeService.cancelarViaje(viaje.id).subscribe({
              next: () => {
                this.presentToast('Viaje cancelado exitosamente', 'success');
                this.cargarViajesProgramados();
              },
              error: (error) => {
                console.error('Error al cancelar viaje:', error);
                this.presentToast('Error al cancelar el viaje', 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  doRefresh(event: any) {
    this.cargarViajesProgramados();
    event.target.complete();
  }

  verDetalles(viaje: Viaje) {
    console.log('Ver detalles del viaje:', viaje);
    // Implementar navegación a detalles
  }

  contactarUsuario(viaje: Viaje) {
    console.log('Contactar usuario:', viaje.conductorNombre);
    // Implementar lógica de contacto
  }

  async completarViaje(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Completado',
      message: '¿Confirmas que este viaje ha sido completado?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, Completar',
          handler: () => {
            this.viajeService.completarViaje(viaje.id).subscribe({
              next: () => {
                this.presentToast('Viaje marcado como completado', 'success');
                this.cargarViajesProgramados();
              },
              error: (error) => {
                console.error('Error al completar viaje:', error);
                this.presentToast('Error al completar el viaje', 'danger');
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
}