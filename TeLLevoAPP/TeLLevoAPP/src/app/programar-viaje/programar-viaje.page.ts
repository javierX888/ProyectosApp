import { Component, OnInit } from '@angular/core';
import { LocationService } from '../services/location.service';
import { ViajeService } from '../services/viaje.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {
  regiones: any[] = [];
  comunasOrigen: any[] = [];
  sedesOrigen: string[] = [];
  regionSeleccionada: number = 0;
  comunaSeleccionada: string = '';
  sedeSeleccionada: string = '';
  horaSalida: string = '';
  asientosDisponibles: number = 1;
  costoPorPasajero: number = 0;

  constructor(
    private locationService: LocationService,
    private viajeService: ViajeService,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.regiones = this.locationService.getRegiones();
  }

  onRegionChange() {
    this.comunasOrigen = this.locationService.getComunas(this.regionSeleccionada);
    this.comunaSeleccionada = '';
    this.sedeSeleccionada = '';
    this.sedesOrigen = [];
  }

  onComunaChange() {
    this.sedesOrigen = this.locationService.getSedes(this.regionSeleccionada, this.comunaSeleccionada);
    this.sedeSeleccionada = '';
  }

  async programarViaje() {
    if (!this.regionSeleccionada || !this.comunaSeleccionada || !this.sedeSeleccionada || !this.horaSalida || this.asientosDisponibles <= 0 || this.costoPorPasajero <= 0) {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos correctamente.',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      return;
    }

    const fechaActual = new Date();
    const [hora, minuto] = this.horaSalida.split(':');
    fechaActual.setHours(parseInt(hora), parseInt(minuto), 0, 0);

    const nuevoViaje = {
      origen: this.sedeSeleccionada,
      destino: `${this.comunaSeleccionada}, Región ${this.regionSeleccionada}`,
      fecha: fechaActual,
      asientosDisponibles: this.asientosDisponibles,
      costo: this.costoPorPasajero
    };

    this.viajeService.programarViaje(nuevoViaje).subscribe(
      async (viajeCreado) => {
        const toast = await this.toastController.create({
          message: 'Viaje programado con éxito',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.router.navigate(['/viajes-programados']);
      },
      async (error) => {
        const toast = await this.toastController.create({
          message: 'Error al programar el viaje',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    );
  }
}