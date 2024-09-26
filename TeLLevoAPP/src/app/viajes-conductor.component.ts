import { Component, OnInit } from '@angular/core';
import { ViajeService, Viaje } from './services/viaje.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-viajes-conductor',
  template: `
    <ion-list>
      <ion-item *ngFor="let viaje of viajes">
        <ion-label>
          <h2>{{ viaje.origen }} - {{ viaje.destino }}</h2>
          <p>Fecha: {{ viaje.fecha | date:'dd/MM/yyyy' }} {{ viaje.hora }}</p>
          <p>Pasajero: {{ viaje.pasajeroNombre || 'No reservado' }}</p>
          <p>Estado: {{ viaje.estado }}</p>
        </ion-label>
        <ion-button slot="end" (click)="aceptarViaje(viaje.id)" *ngIf="viaje.estado === 'reservado'">
          Aceptar
        </ion-button>
      </ion-item>
    </ion-list>
  `
})
export class ViajesConductorComponent implements OnInit {
  viajes: Viaje[] = [];

  constructor(private viajeService: ViajeService, private authService: AuthService) {}

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.viajeService.getViajesProgramados(this.authService.getUsername()).subscribe(
      viajes => this.viajes = viajes
    );
  }

  aceptarViaje(viajeId: number) {
    this.viajeService.aceptarViaje(viajeId).subscribe(
      success => {
        if (success) {
          this.cargarViajes();
        }
      }
    );
  }
}