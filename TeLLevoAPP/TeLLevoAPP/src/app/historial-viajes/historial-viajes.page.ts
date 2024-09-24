import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {
  historialViajes: any[] = [];

  constructor(private viajeService: ViajeService) { }

  ngOnInit() {
    this.cargarHistorialViajes();
  }

  cargarHistorialViajes() {
    // Asumiendo que tienes un método para obtener el historial de viajes
    this.viajeService.getHistorialViajes().subscribe(
      viajes => this.historialViajes = viajes
    );
  }
}