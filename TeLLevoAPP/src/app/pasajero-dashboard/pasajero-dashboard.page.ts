import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ViajeService, Viaje } from '../services/viaje.service';
import { firstValueFrom } from 'rxjs';
@Component({
selector: 'app-pasajero-dashboard',
templateUrl: './pasajero-dashboard.page.html',
styleUrls: ['./pasajero-dashboard.page.scss'],
})
export class PasajeroDashboardPage implements OnInit {
nombreUsuario: string = '';
email: string = '';
profileImage: string | null = null;
viajesReservados: number = 0;
viajesCompletados: number = 0;
proximosViajes: Viaje[] = [];
constructor(
private router: Router,
private apiService: ApiService,
private viajeService: ViajeService
) {}
ngOnInit() {
this.cargarDatos();
}
async cargarDatos() {
try {
// Cargar datos del perfil
const perfil = await firstValueFrom(await this.apiService.getProfile());
this.nombreUsuario = perfil.nombre;
this.email = perfil.email;
// Cargar estadísticas
  const estadisticas = await this.viajeService.getEstadisticasPasajero(this.email);
  this.viajesReservados = estadisticas.viajesReservados;
  this.viajesCompletados = estadisticas.viajesCompletados;

  // Cargar próximos viajes
  this.proximosViajes = await firstValueFrom(
    this.viajeService.getViajesReservados(this.email)
  );
} catch (error) {
  console.error('Error al cargar datos:', error);
}

}
async cerrarSesion() {
await this.apiService.logout();
this.router.navigate(['/login']);
}
verViajesReservados() {
this.router.navigate(['/viajes-reservados']);
}
verHistorial() {
this.router.navigate(['/historial-viajes']);
}
buscarViaje() {
this.router.navigate(['/buscar-viaje']);
}
formatearFecha(fecha: string): string {
return new Date(fecha).toLocaleDateString();
}
getEstadoColor(estado: string): string {
const colores: { [key: string]: string } = {
'disponible': 'primary',
'reservado': 'warning',
'aceptado': 'success',
'cancelado': 'danger',
'completado': 'success'
};
return colores[estado] || 'medium';
}
}