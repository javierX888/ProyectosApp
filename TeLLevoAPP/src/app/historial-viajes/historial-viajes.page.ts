import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service'; // Importar Viaje desde el servicio
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
  
  // Propiedades faltantes
  filtroEstado: string = 'todos';
  historialViajes: Viaje[] = [];
  historialViajesFiltrados: Viaje[] = [];
  esconductor: boolean = false;
  esController: boolean = false;
  totalViajes: number = 0;
  totalGastado: number = 0;

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.viajeService.getHistorialViajes(this.username).subscribe(
      (viajes: Viaje[]) => {
        this.historial = viajes;
        this.historialViajes = viajes;
        this.historialViajesFiltrados = viajes;
        this.totalViajes = viajes.length;
        this.totalGastado = viajes.reduce((total, viaje) => total + viaje.precio, 0);
        this.filtrarViajes();
      },
      error => {
        console.error('Error al cargar historial de viajes:', error);
        this.presentToast('Error al cargar el historial', 'danger');
      }
    );
  }

  filtrarViajes() {
    if (!this.historialViajes) return;
    this.historialViajesFiltrados = this.historialViajes.filter(viaje => 
      this.filtroEstado === 'todos' || viaje.estado === this.filtroEstado
    );
  }

  getEstadoColor(estado: string): string {
    const colores: {[key: string]: string} = {
      'disponible': 'primary',
      'reservado': 'warning',
      'aceptado': 'success',
      'cancelado': 'danger',
      'completado': 'success'
    };
    return colores[estado] || 'medium';
  }

  verDetalles(viaje: Viaje) {
    // Implementar según necesidades
    console.log('Ver detalles del viaje:', viaje);
  }

  contactarUsuario(viaje: Viaje) {
    // Implementar según necesidades
    console.log('Contactar usuario del viaje:', viaje);
  }

  doRefresh(event: any) {
    this.cargarHistorial();
    event.target.complete();
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}