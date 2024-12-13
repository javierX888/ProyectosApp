import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ViajeService } from '../services/viaje.service';
import { Viaje } from '../interfaces/viaje.interface';
import { Vehicle } from '../interfaces/vehicle.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-conductor-dashboard',
  templateUrl: './conductor-dashboard.page.html',
  styleUrls: ['./conductor-dashboard.page.scss'],
})
export class ConductorDashboardPage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';
  profileImage: string | null = null;
  viajesActivos: number = 0;
  totalPasajeros: number = 0;
  showAddVehicleForm: boolean = false;
  vehiculoForm: FormGroup;
  vehicles: Vehicle[] = [];
  viajesProgramados: Viaje[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private fb: FormBuilder
  ) {
    this.vehiculoForm = this.fb.group({
      modeloVehiculo: ['', Validators.required],
      patente: ['', Validators.required],
      licencia: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarVehiculos();
    await this.cargarEstadisticas();
    await this.cargarViajesProgramados();
  }

  async cargarDatosUsuario() {
    try {
      const perfil = await this.authService.getProfile().toPromise();
      this.nombreUsuario = perfil.nombre || '';
      this.email = perfil.email || '';
      this.profileImage = perfil.imagen || null;
    } catch (error) {
      this.presentToast('Error al cargar datos del usuario', 'danger');
    }
  }

  async addVehicle() {
    if (this.vehiculoForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Agregando vehículo...'
      });
      await loading.present();

      try {
        await this.authService.addVehiculo(this.vehiculoForm.value).toPromise();
        await this.cargarVehiculos();
        this.showAddVehicleForm = false;
        this.vehiculoForm.reset();
        this.presentToast('Vehículo agregado exitosamente', 'success');
      } catch (error) {
        this.presentToast('Error al agregar vehículo', 'danger');
      } finally {
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

  async cargarVehiculos() {
    try {
      const vehiculos = await this.authService.getVehiculos().toPromise();
      this.vehicles = vehiculos || [];
    } catch (error) {
      this.presentToast('Error al cargar vehículos', 'danger');
    }
  }

  async cargarEstadisticas() {
    try {
      const viajes = await this.viajeService.getViajesConductor(this.email).toPromise() ?? [];
      this.viajesActivos = viajes.filter((v: Viaje) => 
        v.estado === 'aceptado' || v.estado === 'reservado'
      ).length;
      this.totalPasajeros = viajes.reduce((total: number, viaje: Viaje) => 
        total + (viaje.pasajeros?.length || 0), 0);
    } catch (error) {
      this.presentToast('Error al cargar estadísticas', 'danger');
      this.viajesActivos = 0;
      this.totalPasajeros = 0;
    }
  }

  async cargarViajesProgramados() {
    try {
      const viajes = await this.viajeService.getViajesProgramados(this.email).toPromise() ?? [];
      this.viajesProgramados = viajes;
    } catch (error) {
      this.presentToast('Error al cargar viajes programados', 'danger');
      this.viajesProgramados = [];
    }
  }

  toggleAddVehicleForm() {
    this.showAddVehicleForm = !this.showAddVehicleForm;
    if (!this.showAddVehicleForm) {
      this.vehiculoForm.reset();
    }
  }

  programarViaje() {
    if (this.vehicles.length === 0) {
      this.presentToast('Debe agregar un vehículo antes de programar viajes', 'warning');
      return;
    }
    this.router.navigate(['/programar-viaje']);
  }

  verTodosLosViajes() {
    this.router.navigate(['/viajes-programados']);
  }

  mostrarPerfil() {
    this.router.navigate(['/perfil']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  verViajesProgramados() {
    this.router.navigate(['/viajes-programados']);
  }



  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ionViewWillEnter() {
    this.cargarDatosUsuario();
    this.cargarVehiculos();
    this.cargarEstadisticas();
    this.cargarViajesProgramados();
  }
}