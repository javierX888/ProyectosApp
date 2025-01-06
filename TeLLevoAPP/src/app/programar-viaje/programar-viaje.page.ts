import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { LocationService } from '../services/location.service';
import { AuthService } from '../services/auth.service';
import { ViajeService } from '../services/viaje.service';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  viajeForm: FormGroup;
  sedes: any[] = [];
  comunasDestino: string[] = [];
  regionOrigen: string = '';
  vehicles: any[] = [];
  fechaMinima: string = '';

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private viajeService: ViajeService,
    private toastController: ToastController,
    private router: Router
  ) {
    this.viajeForm = this.fb.group({
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      asientosDisponibles: [1, [Validators.required, Validators.min(1)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      vehiculo: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.fechaMinima = this.getLocalISOTime();
    this.sedes = this.locationService.getSedes();
    this.authService.getVehiculos().subscribe((vehicles) => {
      this.vehicles = vehicles;
    });
  }

  getLocalISOTime(): string {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  }

  onSedeChange() {
    const sede = this.sedes.find((s) => s.nombre === this.viajeForm.value.origen);
    if (sede) {
      this.regionOrigen = sede.region;
      this.comunasDestino = this.locationService.getComunas(sede.region);
    }
  }

  async programarViaje() {
    if (this.viajeForm.invalid) {
      this.presentToast('Por favor complete todos los campos', 'warning');
      return;
    }

    const viaje = this.viajeForm.value;
    viaje.conductorNombre = await this.authService.getUsername();

    try {
      await this.viajeService.programarViaje(viaje).toPromise();
      this.presentToast('Viaje programado exitosamente', 'success');
      this.router.navigate(['/conductor-dashboard']);
    } catch (error) {
      this.presentToast('Error al programar el viaje', 'danger');
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
