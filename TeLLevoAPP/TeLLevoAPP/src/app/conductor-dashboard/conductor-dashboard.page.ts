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
    this.username = this.authService.getUsername();
  }

  programarViaje() {
    this.router.navigate(['/programar-viaje']);
  }

  verViajesProgramados() {
    this.router.navigate(['/viajes-programados']);
  }

  verHistorial() {
    this.router.navigate(['/historial-viajes']);
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}