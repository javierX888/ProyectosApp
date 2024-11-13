import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  viajesDisponibles: Viaje[] = [];
  conductorNombre: string = '';

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.conductorNombre = this.authService.getUsername();
    this.cargarViajesDisponibles();2
  }

  cargarViajesDisponibles() {
    this.viajeService.getViajesDisponibles(this.conductorNombre).subscribe(
      (viajes: Viaje[]) => {
        this.viajesDisponibles = viajes;
      },
      error => {
        console.error('Error al cargar viajes disponibles:', error);
      }
    );
  }

  reservarViaje(viaje: Viaje) {
    const username = this.authService.getUsername();
    this.viajeService.reservarViaje(viaje.id, username).subscribe(
      (success: boolean) => {
        if (success) {
          this.presentToast('Viaje reservado exitosamente.', 'success');
          this.cargarViajesDisponibles(); // Actualizar la lista
        } else {
          this.presentToast('Error al reservar el viaje.', 'danger');
        }
      },
      (error) => {
        console.error('Error al reservar viaje:', error);
        this.presentToast('Error al reservar el viaje.', 'danger');
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
