import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ViajeService, Viaje } from '../services/viaje.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  // Propiedades para almacenar los datos del viaje
  sedes: any[] = [];
  sedeOrigen: string = '';
  regionOrigen: string = '';
  comunaDestino: string = '';
  comunasDestino: string[] = [];
  fecha: string = '';
  hora: string = '';
  horaSeleccionada: string = '';
  asientosDisponibles: number = 1;
  precio: number = 0;
  patente: string = '';
  fechaMinima: string = new Date().toISOString();
  horaMinima: string = '20:30';
  horaMaxima: string = '23:00';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private viajeService: ViajeService,
    private locationService: LocationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.sedes = this.locationService.getSedes();
    this.fechaMinima = new Date().toISOString();
    this.hora = '20:30';
    this.horaSeleccionada = '20:30';
  }

  onHoraChange(event: any) {
    const selectedTime = new Date(event.detail.value);
    this.horaSeleccionada = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Método que se ejecuta cuando se cambia la sede de origen
  onSedeChange() {
    this.regionOrigen = this.locationService.getRegionBySede(this.sedeOrigen) || '';
    this.comunasDestino = this.locationService.getComunasByRegion(this.regionOrigen);
  }
  
  // Método para programar un nuevo viaje
  programarViaje() {
    if (this.sedeOrigen && this.regionOrigen && this.comunaDestino && this.fecha && this.horaSeleccionada && this.asientosDisponibles && this.precio && this.patente) {
      const nuevoViaje: Viaje = {
        id: 0, // Se asignará en el servicio
        origen: this.sedeOrigen,
        destino: this.comunaDestino,
        fecha: this.fecha,
        hora: this.horaSeleccionada,
        asientosDisponibles: this.asientosDisponibles,
        precio: this.precio,
        conductorNombre: this.authService.getUsername(),
        patente: this.patente,
        estado: 'disponible'
      };
      
      this.viajeService.programarViaje(nuevoViaje).subscribe(
        viaje => {
          this.mostrarToast('Viaje programado con éxito', 'success');
          this.router.navigate(['/conductor-dashboard']);
        },
        error => {
          this.mostrarToast('Error al programar el viaje', 'danger');
        }
      );
    } else {
      this.mostrarToast('Por favor, completa todos los campos', 'warning');
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