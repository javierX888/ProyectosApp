import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  sedes: any[] = [];
  sedeSeleccionada: string = '';
  viajesDisponibles: any[] = [];

  constructor(
    private viajeService: ViajeService,
    private toastController: ToastController,
    private authService: AuthService,
    private locationService: LocationService
  ) { }

  ngOnInit() {
    // Cargar las sedes disponibles
    this.sedes = this.locationService.getSedes();
  }

  // Método que se ejecuta cuando se cambia la sede seleccionada
  onSedeChange() {
    this.cargarViajesDisponibles();
  }

  // Cargar los viajes disponibles para la sede seleccionada
  cargarViajesDisponibles() {
    this.viajeService.getViajesDisponibles().subscribe(
      viajes => {
        this.viajesDisponibles = viajes.filter(v => v.origen.includes(this.sedeSeleccionada));
      }
    );
  }

  // Método para reservar un viaje
  async reservarViaje(viaje: any) {
    const reservado = await this.viajeService.reservarViaje(viaje.id, this.authService.getUsername()).toPromise();
    if (reservado) {
      this.mostrarToast('Viaje reservado con éxito', 'success');
      this.cargarViajesDisponibles();
    } else {
      this.mostrarToast('Error al reservar el viaje', 'danger');
    }
  }

  // Método para mostrar mensajes toast
  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}