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
  
  // Propiedades relacionadas con los vehículos
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

  async ngOnInit() {
    // Inicialización de datos
    this.sedes = this.locationService.getSedes();
    this.fechaMinima = this.getLocalISOTime();
    this.vehicles = await this.authService.getVehicles();
    if (this.vehicles.length > 0) {
      this.selectedVehicle = this.vehicles[0];
    }
  }

  // Obtener la fecha y hora local en formato ISO
  getLocalISOTime(): string {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
  }

  // Actualizar comunas cuando cambia la sede
  onSedeChange() {
    this.regionOrigen = this.locationService.getRegionBySede(this.sedeOrigen) || '';
    this.comunasDestino = this.locationService.getComunasByRegion(this.regionOrigen);
  }

  // Método principal para programar un viaje
  async programarViaje() {
    if (this.viajeForm.invalid) {
      Object.keys(this.viajeForm.controls).forEach((field) => {
        const control = this.viajeForm.controls[field];
        control.markAsTouched({ onlySelf: true });
      });
      await this.mostrarToast('Por favor, corrige los errores en el formulario', 'warning');
      return;
    }

    // Crear el objeto del nuevo viaje
    const nuevoViaje: Viaje = {
      id: 0,
      origen: this.sedeOrigen,
      destino: this.comunaDestino,
      fecha: this.fecha,
      asientosDisponibles: this.asientosDisponibles,
      precio: this.precio,
      conductorNombre: this.authService.getUsername(),
      patente: this.selectedVehicle ? this.selectedVehicle.patente : this.patente,
      vehiculo: this.selectedVehicle || null,
      estado: 'disponible',
      pasajeros: []
    };

    try {
      await this.viajeService.programarViaje(nuevoViaje).toPromise();
      await this.mostrarToast('Viaje programado con éxito', 'success');
      this.router.navigate(['/conductor-dashboard']);
    } catch (error) {
      console.error('Error al programar viaje:', error);
      await this.mostrarToast('Error al programar el viaje', 'danger');
    }
  }

  // Métodos para manejar vehículos
  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
  }

  async addVehicle() {
    const success = await this.authService.addVehicle(this.newVehicle);
    if (success) {
      this.vehicles = await this.authService.getVehicles();
      this.selectedVehicle = this.newVehicle;
      this.newVehicle = { modeloVehiculo: '', patente: '', licencia: '' };
      this.showAddVehicleForm = false;
      await this.mostrarToast('Vehículo agregado con éxito', 'success');
    }
  }

  // Utilidad para mostrar mensajes toast
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    await toast.present();
  }
}