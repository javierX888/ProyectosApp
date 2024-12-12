import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { ViajeService } from '../services/viaje.service';
import { Viaje } from '../interfaces/viaje.interface';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  viajes: Viaje[] = [];
  filtros = {
    sede: '',
    fecha: '',
    rangoHora: ''
  };
  sedes = [
    { sede: 'Plaza Norte', comuna: 'Huechuraba' },
    { sede: 'Plaza Oeste', comuna: 'Cerrillos' },
    { sede: 'Plaza Sur', comuna: 'San Bernardo' },
    { sede: 'Plaza Vespucio', comuna: 'La Florida' }
  ];
  fechaMinima: string = new Date().toISOString();
  fechaMaxima: string = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

  constructor(
    private viajeService: ViajeService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.buscarViajes();
  }

  async buscarViajes() {
    const loading = await this.loadingController.create({
      message: 'Buscando viajes...'
    });
    await loading.present();

    try {
      this.viajes = await this.viajeService.getViajes();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Error al buscar viajes',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  async reservarViaje(viaje: Viaje) {
    const loading = await this.loadingController.create({
      message: 'Reservando viaje...'
    });
    await loading.present();

    try {
      await this.viajeService.reservarViaje(viaje.id, 'usuario_actual');
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Viaje reservado exitosamente',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.buscarViajes();
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Error al reservar el viaje',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  verDetalles(viaje: Viaje) {
    console.log('Ver detalles del viaje:', viaje);
    // Implementar navegación a detalles
  }

  contactarConductor(viaje: Viaje) {
    console.log('Contactar conductor:', viaje.conductorNombre);
    // Implementar lógica de contacto
  }

  doRefresh(event: any) {
    this.buscarViajes().then(() => {
      event.target.complete();
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }

  filtrarViajes() {
    // Implementar lógica de filtrado
    console.log('Filtros aplicados:', this.filtros);
    this.buscarViajes();
  }
}