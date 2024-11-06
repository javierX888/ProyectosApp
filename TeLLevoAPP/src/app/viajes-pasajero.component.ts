import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from './services/viaje.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-viajes-pasajero',
  template: `
    <ion-list>
      <ion-item *ngFor="let viaje of viajes">
        <ion-label>
          <h2>{{ viaje.origen }} - {{ viaje.destino }}</h2>
          <p>Fecha: {{ viaje.fecha | date:'dd/MM/yyyy' }} </p>
          <p>Conductor: {{ viaje.conductorNombre }}</p>
          <p>Estado: {{ viaje.estado }}</p>
        </ion-label>
        <ion-button slot="end" (click)="cancelarReserva(viaje.id)" *ngIf="viaje.estado === 'reservado'">
          Cancelar
        </ion-button>
      </ion-item>
    </ion-list>
  `
})
export class ViajesPasajeroComponent implements OnInit {
  viajes: Viaje[] = [];

  constructor(private viajeService: ViajeService, private authService: AuthService) {}

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.viajeService.getViajesReservados(this.authService.getUsername()).subscribe(
      viajes => this.viajes = viajes
    );
  }

  cancelarReserva(viajeId: number) {
    this.viajeService.cancelarViaje(viajeId).subscribe(
      success => {
        if (success) {
          this.cargarViajes();
        }
      }
    );
  }
}