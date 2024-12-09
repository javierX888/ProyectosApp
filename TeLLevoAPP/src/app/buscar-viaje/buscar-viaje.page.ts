import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ViajeService, Viaje } from '../services/viaje.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  filtros = {
    sede: '',
    fecha: new Date().toISOString(),
    rangoHora: ''
  };

  viajes: Viaje[] = [];
  sedes = [
    { sede: 'Antonio Varas', comuna: 'Providencia' },
    { sede: 'San Joaquín', comuna: 'San Joaquín' },
    { sede: 'Plaza Vespucio', comuna: 'La Florida' },
    { sede: 'Maipú', comuna: 'Maipú' },
    { sede: 'Melipilla', comuna: 'Melipilla' }
  ];

  fechaMinima = new Date().toISOString();
  fechaMaxima = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  constructor(
    private apiService: ApiService,
    private viajeService: ViajeService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.buscarViajes();
  }

  async buscarViajes() {
    const loading = await this.loadingCtrl.create({
      message: 'Buscando viajes disponibles...'
    });
    await loading.present();
  
    try {
      const sedeSeleccionada = this.filtros.sede || '';
      // Llamamos al método del viaje.service que obtiene viajes desde la API por origen
      const viajesDisponibles = await firstValueFrom(this.viajeService.getViajesPorOrigen(sedeSeleccionada));
      this.viajes = viajesDisponibles;
    } catch (error) {
      console.error('Error al buscar viajes:', error);
      this.mostrarToast('Error al cargar los viajes disponibles', 'danger');
    } finally {
      loading.dismiss();
    }
  }
  
  async reservarViaje(viaje: Viaje) {
    const loading = await this.loadingCtrl.create({
      message: 'Procesando reserva...'
    });
    await loading.present();

    try {
      const username = this.authService.getUserEmail();
      await firstValueFrom(this.viajeService.reservarViaje(viaje.id, username));
      this.mostrarToast('Viaje reservado exitosamente', 'success');
      this.buscarViajes();
    } catch (error) {
      console.error('Error al reservar:', error);
      this.mostrarToast('Error al realizar la reserva', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  async doRefresh(event: any) {
    try {
      await this.buscarViajes();
    } finally {
      event.target.complete();
    }
  }

  async mostrarToast(mensaje: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  verDetalles(viaje: Viaje) {
    console.log('Ver detalles del viaje:', viaje);
  }

  contactarConductor(viaje: Viaje) {
    console.log('Contactar al conductor:', viaje.conductorNombre);
  }
}