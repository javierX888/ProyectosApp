import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  
  // Propiedades faltantes del template
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
    private authService: AuthService
  ) { }

  getLocalISOTime(): string {
    const now = new Date();
    const tzoffset = now.getTimezoneOffset() * 60000;
    return (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
  }

  async ngOnInit() {
    try {
      this.sedes = this.locationService.getSedes();
      this.fechaMinima = this.getLocalISOTime();
      const vehiculos = await this.authService.getVehiculos().toPromise();
      this.vehicles = vehiculos || [];
      if (this.vehicles.length > 0) {
        this.selectedVehicle = this.vehicles[0];
      }
    } catch (error) {
      this.presentToast('Error al cargar datos', 'danger');
    }
  }

  onSedeChange() {
    // Implementar lógica cuando cambia la sede
    if (this.sedeOrigen) {
      const sede = this.sedes.find(s => s.nombre === this.sedeOrigen);
      if (sede) {
        this.regionOrigen = sede.region;
        this.comunasDestino = this.locationService.getComunas(sede.region);
      }
    }
  }

  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
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

      await this.viajeService.programarViaje(viaje as Viaje).toPromise();
      this.presentToast('Viaje programado exitosamente', 'success');
      this.router.navigate(['/conductor-dashboard']);
    } catch (error) {
      this.presentToast('Error al programar el viaje', 'danger');
    }
  }

  validarFormulario(): boolean {
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
        this.presentToast('Por favor complete todos los campos del vehículo', 'warning');
        return;
      }

      loading = await this.loadingController.create({
        message: 'Guardando vehículo...'
      });
      await loading.present();

      await this.authService.addVehiculo(this.newVehicle).toPromise();
      const vehiculos = await this.authService.getVehiculos().toPromise();
      this.vehicles = vehiculos || [];
      
      this.newVehicle = {
        modeloVehiculo: '',
        patente: '',
        licencia: ''
      };
      
      this.showAddVehicleForm = false;
      this.presentToast('Vehículo agregado exitosamente', 'success');

    } catch (error) {
      console.error('Error al agregar vehículo:', error);
      this.presentToast('Error al agregar vehículo', 'danger');
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