import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-pasajero-dashboard',
  templateUrl: './pasajero-dashboard.page.html',
  styleUrls: ['./pasajero-dashboard.page.scss'],
})
export class PasajeroDashboardPage implements OnInit {
  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
  }

  buscarViaje() {
    this.router.navigate(['/buscar-viaje']);
  }

  verViajesReservados() {
    this.router.navigate(['/viajes-reservados']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}