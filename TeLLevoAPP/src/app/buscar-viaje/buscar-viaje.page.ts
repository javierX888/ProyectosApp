import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ViajeService, Viaje } from '../services/viaje.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-buscar-viaje',
  templateUrl: './buscar-viaje.page.html',
  styleUrls: ['./buscar-viaje.page.scss'],
})
export class BuscarViajePage implements OnInit {
  sedes: any[] = [];
  viajes: Viaje[] = [];
  filtros = {
    sede: '',
    fecha: new Date().toISOString(),
    rangoHora: 'tarde'
  };

  fechaMinima = new Date().toISOString();
  fechaMaxima = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  constructor(
    private viajeService: ViajeService,
    private locationService: LocationService,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.cargarSedes();
    this.buscarViajes();
  }

  cargarSedes() {
    this.sedes = this.locationService.getSedes();
  }

  async buscarViajes() {
    const loading = await this.loadingController.create({
      message: 'Buscando viajes...'
    });
    await loading.present();

    try {
      this.viajeService.getViajesDisponibles().subscribe(
        viajes => {
          this.viajes = viajes.filter(viaje => {
            // Filtrar por sede si está seleccionada
            if (this.filtros.sede && !viaje.origen.includes(this.filtros.sede)) {
              return false;
            }
            
            // Filtrar por fecha
            const viajeDate = new Date(viaje.fecha);
            const filtroDate = new Date(this.filtros.fecha);
            if (viajeDate.toDateString() !== filtroDate.toDateString()) {
              return false;
            }

            return true;
          });
          loading.dismiss();
        },
        error => {
          console.error('Error al buscar viajes:', error);
          this.mostrarToast('Error al buscar viajes');
          loading.dismiss();
        }
      );
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      this.mostrarToast('Error al buscar viajes');
      loading.dismiss();
    }
  }

  async reservarViaje(viaje: Viaje) {
    const alert = await this.alertController.create({
      header: 'Confirmar Reserva',
      message: `¿Deseas reservar un asiento en este viaje?
                <br><br>
                Origen: ${viaje.origen}
                <br>
                Destino: ${viaje.destino}
                <br>
                Precio: $${viaje.precio}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Reservar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Procesando reserva...'
            });
            await loading.present();

            try {
              const username = this.authService.getUsername();
              this.viajeService.reservarViaje(viaje.id, username).subscribe(
                success => {
                  if (success) {
                    this.mostrarToast('Reserva realizada con éxito', 'success');
                    this.buscarViajes();
                  } else {
                    this.mostrarToast('Error al realizar la reserva');
                  }
                  loading.dismiss();
                },
                error => {
                  console.error('Error al reservar:', error);
                  this.mostrarToast('Error al realizar la reserva');
                  loading.dismiss();
                }
              );
            } catch (error) {
              console.error('Error:', error);
              this.mostrarToast('Error al realizar la reserva');
              loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async doRefresh(event: any) {
    await this.buscarViajes();
    event.target.complete();
  }

  private async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  verDetalles(viaje: Viaje) {
    // Implementar vista de detalles
    console.log('Ver detalles del viaje:', viaje);
  }

  contactarConductor(viaje: Viaje) {
    // Implementar sistema de mensajería
    console.log('Contactar conductor:', viaje.conductorNombre);
  }
}