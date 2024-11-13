lsimport { Component, OnInit } from '@angular/core';
import { ViajeService, EstadisticasPasajero } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pasajero-dashboard',
  templateUrl: './pasajero-dashboard.page.html',
  styleUrls: ['./pasajero-dashboard.page.scss'],
})
export class PasajeroDashboardPage implements OnInit {
  nombreUsuario: string = '';
  viajesReservados: number = 0;
  viajesCompletados: number = 0;

  constructor(
    private viajeService: ViajeService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.nombreUsuario = this.authService.getNombre();
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.viajeService.getEstadisticasPasajero(this.authService.getUsername())
      .then((stats: EstadisticasPasajero) => {
        this.viajesReservados = stats.viajesReservados;
        this.viajesCompletados = stats.viajesCompletados;
      })
      .catch(error => {
        console.error('Error cargando estadísticas:', error);
      });
  }
}
