import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../app/services/api.service';

@Component({
  selector: 'app-viajes-conductor',
  templateUrl: './viajes-conductor.component.html',
  styleUrls: ['./viajes-conductor.component.scss']
})
export class ViajesConductorComponent implements OnInit {
  @Input() viajeId: number = 0;
  viajes: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarViajes();
  }

  async cargarViajes() {
    // Implementar carga de viajes
  }

  async aceptarViaje(viajeId: number) {
    // Implementar aceptación
  }
}