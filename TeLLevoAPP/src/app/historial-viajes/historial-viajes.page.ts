import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {
  historialViajes: Viaje[] = [];
  historialViajesFiltrados: Viaje[] = [];
  filtroEstado: string = 'todos';
  esController: boolean = false;
  totalViajes: number = 0;
  totalGastado: number = 0;
  esconductor: boolean = false;

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.esController = this.authService.getUserType() === 'conductor';
  }

  ngOnInit() {
    this.cargarHistorialViajes();
  }

  async cargarHistorialViajes() {
    const loading = await this.loadingController.create({
      message: 'Cargando historial...'
    });
    await loading.present();

    try {
      const username = this.authService.getUsername();
      this.viajeService.getHistorialViajes(username).subscribe(
        viajes => {
          this.historialViajes = viajes;
          this.filtrarViajes();
          this.calcularEstadisticas();
          loading.dismiss();
        },
        error => {
          console.error('Error al cargar historial:', error);
          this.mostrarToast('Error al cargar el historial de viajes');
          loading.dismiss();
        }
      );
    } catch (error) {
      console.error('Error:', error);
      loading.dismiss();
    }
  }

  filtrarViajes() {
    if (this.filtroEstado === 'todos') {
      this.historialViajesFiltrados = [...this.historialViajes];
    } else {
      this.historialViajesFiltrados = this.historialViajes.filter(
        viaje => viaje.estado === this.filtroEstado
      );
    }
  }

  calcularEstadisticas() {
    this.totalViajes = this.historialViajes.length;
    this.totalGastado = this.historialViajes.reduce(
      (total, viaje) => total + viaje.precio, 
      0
    );
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'completado':
        return 'success';
      case 'cancelado':
        return 'danger';
      case 'en_curso':
        return 'warning';
      default:
        return 'medium';
    }
  }

  async verDetalles(viaje: Viaje) {
    // Implementar modal de detalles
    console.log('Ver detalles:', viaje);
  }

  async contactarUsuario(viaje: Viaje) {
    // Implementar función de contacto
    console.log('Contactar usuario:', viaje);
  }

  async doRefresh(event: any) {
    await this.cargarHistorialViajes();
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
}