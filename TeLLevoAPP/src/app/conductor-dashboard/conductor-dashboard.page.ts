import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-conductor-dashboard',
  templateUrl: './conductor-dashboard.page.html',
  styleUrls: ['./conductor-dashboard.page.scss'],
})
export class ConductorDashboardPage implements OnInit {
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener el nombre de usuario al inicializar la página
    this.username = this.authService.getUsername();
  }

  // Navegar a la página de programar viaje
  programarViaje() {
    this.router.navigate(['/programar-viaje']);
  }

  // Navegar a la página de historial de viajes
  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  // Cerrar sesión y volver a la página de inicio
  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}