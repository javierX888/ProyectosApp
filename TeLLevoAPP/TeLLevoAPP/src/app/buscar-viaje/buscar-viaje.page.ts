import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  viajesDisponibles: any[] = [];

  constructor(
    private viajeService: ViajeService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarViajesDisponibles();
  }

  cargarViajesDisponibles() {
    this.viajeService.getViajesDisponibles().subscribe(
      (viajes: any[]) => this.viajesDisponibles = viajes
    );
  }

  async reservarViaje(viaje: any) {
    const reservado = await this.viajeService.reservarViaje(viaje.id, 1).toPromise();
    if (reservado) {
      await this.showToast('Viaje reservado con éxito', 'success');
      this.cargarViajesDisponibles();
    } else {
      await this.showToast('Error al reservar el viaje');
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}