import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-viajes-programados',
  templateUrl: './viajes-programados.page.html',
  styleUrls: ['./viajes-programados.page.scss'],
})
export class ViajesProgramadosPage implements OnInit {
  viajesProgramados: any[] = [];

  constructor(private viajeService: ViajeService, private authService: AuthService) { }
  

  ngOnInit() {
    this.cargarViajesProgramados();
  }

  cargarViajesProgramados() {
    this.viajeService.getViajesProgramados(this.authService.getUsername()).subscribe(
      viajes => this.viajesProgramados = viajes
    );
  }
}