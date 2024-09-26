import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {
  historialViajes: any[] = [];

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.cargarHistorialViajes();
  }

  cargarHistorialViajes() {
    const username = this.authService.getUsername();
    this.viajeService.getHistorialViajes(username).subscribe(
      viajes => this.historialViajes = viajes
    );
  }
}