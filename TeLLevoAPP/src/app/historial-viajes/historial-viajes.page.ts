import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {
  historial: Viaje[] = [];
  username: string = '';

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.viajeService.getHistorialViajes(this.username).subscribe(
      (viajes: Viaje[]) => {
        this.historial = viajes;
      },
      error => {
        console.error('Error al cargar historial de viajes:', error);
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
