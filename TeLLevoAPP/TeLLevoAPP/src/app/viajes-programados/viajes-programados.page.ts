import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';

@Component({
  selector: 'app-viajes-programados',
  templateUrl: './viajes-programados.page.html',
  styleUrls: ['./viajes-programados.page.scss'],
})
export class ViajesProgramadosPage implements OnInit {
  viajesProgramados: any[] = [];

  constructor(private viajeService: ViajeService) { }

  ngOnInit() {
    this.cargarViajesProgramados();
  }

  cargarViajesProgramados() {
    this.viajeService.getViajesProgramados().subscribe(
      viajes => this.viajesProgramados = viajes
    );
  }

  verDetalles(viaje: any) {
    console.log('Ver detalles del viaje', viaje);
    // Aquí puedes implementar la navegación a una página de detalles del viaje
  }
}