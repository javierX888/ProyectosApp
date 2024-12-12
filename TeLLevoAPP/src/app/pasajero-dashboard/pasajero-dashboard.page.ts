import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { ViajeService } from '../services/viaje.service';
import { firstValueFrom } from 'rxjs';
import { Viaje } from '../interfaces/viaje.interface';

interface EstadisticasPasajero {
  viajesReservados: number;
  viajesCompletados: number;
}

interface PerfilUsuario {
  nombre: string;
  email: string;
}

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
    private viajeService: ViajeService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Cargar datos del perfil
      const perfil = await firstValueFrom(this.apiService.getProfile()) as PerfilUsuario;
      this.nombreUsuario = perfil.nombre;
      this.email = perfil.email;

      // Cargar estadísticas
      const estadisticas = await firstValueFrom(
        this.viajeService.getEstadisticasPasajero(this.email)
      ) as EstadisticasPasajero;
      
      this.viajesReservados = estadisticas.viajesReservados;
      this.viajesCompletados = estadisticas.viajesCompletados;

      // Cargar próximos viajes
      this.proximosViajes = await firstValueFrom(
        this.viajeService.getViajesReservados(this.email)
      );
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.mostrarError('Error al cargar los datos');
    }
  }

  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, cerrar sesión',
          handler: async () => {
            await this.apiService.logout();
            this.router.navigate(['/login']);
          }
        }
      ]
    });

    await alert.present();
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

  private async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
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