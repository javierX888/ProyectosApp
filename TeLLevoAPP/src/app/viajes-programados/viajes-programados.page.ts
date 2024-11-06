import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { LoadingController, ModalController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-programados',
  templateUrl: './viajes-programados.page.html',
  styleUrls: ['./viajes-programados.page.scss'],
})
export class ViajesProgramadosPage implements OnInit {
  historialViajes: Viaje[] = [];
  historialViajesFiltrados: Viaje[] = [];
  filtroEstado: string = 'todos';
  esconductor: boolean = false;
  totalViajes: number = 0;
  totalGastado: number = 0;

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController // Si vas a usar alertas
  ) {
    this.esconductor = this.authService.getUserType() === 'conductor';
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
          this.historialViajes = viajes.map(viaje => ({
            ...viaje,
            pasajeros: viaje.pasajeros ?? [] // Asegura que pasajeros sea un arreglo
          }));
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
    } catch (error: any) { // Tipar error como any
      console.error('Error:', error);
      loading.dismiss();
    }
  }

  // **Añadir el método `cargarViajesProgramados` llamado en la plantilla**
  async cargarViajesProgramados() {
    await this.cargarHistorialViajes();
  }

  // **Añadir el método `confirmarViaje` llamado en la plantilla**
  async confirmarViaje(viaje: Viaje) {
    // Aquí puedes implementar la lógica para confirmar el viaje
    console.log('Confirmar viaje:', viaje);
    // Ejemplo de lógica:
    // viaje.estado = 'completado';
    // Actualiza el viaje en el servicio o backend
    // Muestra un mensaje de éxito
  }

  // **Añadir el método `cancelarViaje` llamado en la plantilla**
  async cancelarViaje(viaje: Viaje) {
    // Aquí puedes implementar la lógica para cancelar el viaje
    console.log('Cancelar viaje:', viaje);
    // Ejemplo de lógica:
    // viaje.estado = 'cancelado';
    // Actualiza el viaje en el servicio o backend
    // Muestra un mensaje de éxito
  }

  // **Añadir el método `editarViaje` llamado en la plantilla**
  async editarViaje(viaje: Viaje) {
    // Aquí puedes implementar la lógica para editar el viaje
    console.log('Editar viaje:', viaje);
    // Podrías abrir un modal o navegar a una página de edición
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