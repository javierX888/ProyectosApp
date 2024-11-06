import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ViajeService, Viaje } from '../services/viaje.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  @ViewChild('viajeForm') viajeForm!: NgForm;

  // Propiedades para almacenar los datos del viaje
  sedes: any[] = [];
  sedeOrigen: string = '';
  regionOrigen: string = '';
  comunaDestino: string = '';
  comunasDestino: string[] = [];
  fecha: string = '';
  asientosDisponibles: number = 1; 
  precio: number = 0;
  patente: string = '';
  fechaMinima: string = '';
  vehicles: any[] = [];
  selectedVehicle: any;
  showAddVehicleForm: boolean = false;
  newVehicle: any = {
    modeloVehiculo: '',
    patente: '',
    licencia: ''
  };
  
  constructor(
    private router: Router,
    private toastController: ToastController,
    private viajeService: ViajeService,
    private locationService: LocationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.sedes = this.locationService.getSedes();
    this.fechaMinima = this.getLocalISOTime();
    this.vehicles = this.authService.getVehicles();
    if (this.vehicles.length > 0) {
      this.selectedVehicle = this.vehicles[0];
    }
  }

  // Método para obtener la fecha y hora en ISO local
  getLocalISOTime(): string {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // Offset en milisegundos
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime;
  }

  // Método que se ejecuta cuando se cambia la sede de origen
  onSedeChange() {
    this.regionOrigen = this.locationService.getRegionBySede(this.sedeOrigen) || '';
    this.comunasDestino = this.locationService.getComunasByRegion(this.regionOrigen);
  }
  
  // Método para programar un nuevo viaje
  programarViaje() {
    if (this.viajeForm.invalid) {
      // Marcar todos los controles como tocados para mostrar mensajes de error
      Object.keys(this.viajeForm.controls).forEach((field) => {
        const control = this.viajeForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      this.mostrarToast('Por favor, corrige los errores en el formulario', 'warning');
      return;
    }

    const nuevoViaje: Viaje = {
      id: 0, // Se asignará en el servicio
      origen: this.sedeOrigen,
      destino: this.comunaDestino,
      fecha: this.fecha,
      // hora: this.horaSeleccionada, // Descomenta si usas hora
      asientosDisponibles: this.asientosDisponibles,
      precio: this.precio,
      conductorNombre: this.authService.getUsername(),
      patente: this.selectedVehicle ? this.selectedVehicle.patente : this.patente,
      vehiculo: this.selectedVehicle ? this.selectedVehicle : null,
      conductor: this.authService.getUsername(),
      estado: 'disponible',
      pasajeros: [] // Inicializar como array vacío
    };
    
    this.viajeService.programarViaje(nuevoViaje).subscribe(
      (viaje) => {
        this.mostrarToast('Viaje programado con éxito', 'success');
        this.router.navigate(['/conductor-dashboard']);
      },
      (error) => {
        this.mostrarToast('Error al programar el viaje', 'danger');
      }
    );
  }

  // Método para mostrar el formulario de agregar vehículo
  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
  }

  // Método para agregar un nuevo vehículo
  addVehicle() {
    this.authService.addVehicle(this.newVehicle);
    this.vehicles.push(this.newVehicle);
    this.selectedVehicle = this.newVehicle;
    this.newVehicle = { modeloVehiculo: '', patente: '', licencia: '' };
    this.showAddVehicleForm = false;
    this.mostrarToast('Vehículo agregado con éxito', 'success');
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
