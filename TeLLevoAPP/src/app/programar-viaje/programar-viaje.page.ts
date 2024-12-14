import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { ViajeService } from '../services/viaje.service';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { Vehicle } from '../interfaces/vehicle.interface';
import { Sede } from '../interfaces/sede.interface';
import { Viaje } from '../interfaces/viaje.interface';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  origen: string = '';
  destino: string = '';
  fecha: string = '';
  hora: string = '';
  asientosDisponibles: number = 1;
  precio: number = 0;
  conductorNombre: string = '';
  fechaMinima: string = '';
  sedes: Sede[] = [];
  vehicles: Vehicle[] = [];
  selectedVehicle: Vehicle | null = null;
  showAddVehicleForm = false;
  viajeForm: FormGroup;
  sedeOrigen: string = '';
  regionOrigen: string = '';
  comunaDestino: string = '';
  comunasDestino: string[] = [];

  newVehicle: Vehicle = {
    modeloVehiculo: '',
    patente: '',
    licencia: ''
  };

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private viajeService: ViajeService,
    private locationService: LocationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { 
    this.viajeForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      asientosDisponibles: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]]
    });
  }

  getLocalISOTime(): string {
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
  }

  async ngOnInit() {
    try {
      this.sedes = this.locationService.getSedes();
      console.log('Sedes cargadas:', this.sedes); // Verifica las sedes cargadas

      this.fechaMinima = this.getLocalISOTime();
      console.log('Fecha mínima para selección:', this.fechaMinima); // Verifica la fecha mínima configurada

      const vehiculos = await this.authService.getVehiculos().toPromise();
      console.log('Vehículos cargados:', vehiculos); // Verifica los vehículos obtenidos del servicio

      this.vehicles = vehiculos || [];
      if (this.vehicles.length > 0) {
        this.selectedVehicle = this.vehicles[0];
        console.log('Vehículo seleccionado por defecto:', this.selectedVehicle); // Verifica el vehículo seleccionado por defecto
      }
    } catch (error) {
      console.error('Error al inicializar datos:', error);
      this.presentToast('Error al cargar datos', 'danger');
    }
  }

  onSedeChange() {
    console.log('Sede seleccionada:', this.sedeOrigen); // Verifica la sede seleccionada
    if (this.sedeOrigen) {
      const sede = this.sedes.find(s => s.nombre === this.sedeOrigen);
      console.log('Sede encontrada:', sede); // Verifica si se encontró la sede correspondiente
      if (sede) {
        this.regionOrigen = sede.region;
        console.log('Región encontrada:', this.regionOrigen); // Verifica la región asignada

        this.comunasDestino = this.locationService.getComunas(sede.region);
        console.log('Comunas disponibles para la región:', this.comunasDestino); // Verifica las comunas obtenidas
      } else {
        this.regionOrigen = '';
        this.comunasDestino = [];
        console.warn('No se encontró la sede seleccionada en las sedes disponibles.'); // Advertencia si no se encuentra la sede
      }
    }
  }

  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
    console.log('Formulario para agregar vehículo:', this.showAddVehicleForm ? 'Abierto' : 'Cerrado'); // Verifica el estado del formulario
  }

  async programarViaje() {
    if (!this.validarFormulario()) return;

    try {
      const viaje: Partial<Viaje> = {
        origen: this.origen,
        destino: this.destino,
        fecha: this.fecha,
        hora: this.hora,
        asientosDisponibles: this.asientosDisponibles,
        precio: this.precio,
        conductorNombre: await this.authService.getUsername(),
        estado: 'disponible',
        vehiculo: {
          modeloVehiculo: this.selectedVehicle?.modeloVehiculo || '',
          patente: this.selectedVehicle?.patente || ''
        },
        pasajeros: []
      };

      console.log('Datos del viaje a programar:', viaje); // Verifica los datos antes de enviarlos

      await this.viajeService.programarViaje(viaje as Viaje).toPromise();
      this.presentToast('Viaje programado exitosamente', 'success');
      this.router.navigate(['/conductor-dashboard']);
    } catch (error) {
      console.error('Error al programar el viaje:', error);
      this.presentToast('Error al programar el viaje', 'danger');
    }
  }

  validarFormulario(): boolean {
    console.log('Validando formulario:', {
      origen: this.origen,
      destino: this.destino,
      fecha: this.fecha,
      hora: this.hora,
      selectedVehicle: this.selectedVehicle
    }); // Verifica los datos del formulario antes de validarlos

    if (!this.origen || !this.destino || !this.fecha || !this.hora || !this.selectedVehicle) {
      this.presentToast('Por favor complete todos los campos', 'warning');
      return false;
    }
    return true;
  }

  async addNewVehicle() {
    let loading: HTMLIonLoadingElement | null = null;
    try {
      if (!this.newVehicle.modeloVehiculo || !this.newVehicle.patente || !this.newVehicle.licencia) {
        this.presentToast('Complete todos los campos del vehículo', 'warning');
        return;
      }

      console.log('Nuevo vehículo a guardar:', this.newVehicle); // Verifica los datos del nuevo vehículo

      loading = await this.loadingController.create({
        message: 'Guardando vehículo...'
      });
      await loading.present();

      const response = await this.authService.addVehiculo(this.newVehicle).toPromise();
      console.log('Respuesta al agregar vehículo:', response); // Verifica la respuesta al agregar el vehículo

      if (response?.vehicle) {
        this.vehicles = [...this.vehicles, response.vehicle];
        this.selectedVehicle = response.vehicle;
        
        this.showAddVehicleForm = false;
        this.newVehicle = {
          modeloVehiculo: '',
          patente: '',
          licencia: ''
        };

        this.presentToast('Vehículo agregado exitosamente', 'success');
      }

    } catch (error: any) {
      console.error('Error al agregar vehículo:', error);
      const errorMessage = error?.error?.message || error?.message || 'Error desconocido';
      this.presentToast(`Error al agregar vehículo: ${errorMessage}`, 'danger');
    } finally {
      if (loading) {
        await loading.dismiss();
      }
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
