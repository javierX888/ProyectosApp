import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora?: string; // Opcional si usas hora
  asientosDisponibles: number;
  precio: number;
  conductorNombre: string;
  patente?: string;
  vehiculo: any;
  estado: 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado';
  pasajeros: string[];
  pasajeroNombre?: string;
}

export interface EstadisticasConductor {
  viajesActivos: number;
  totalPasajeros: number;
}

export interface EstadisticasPasajero {
  viajesReservados: number;
  viajesCompletados: number;
}

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private viajes: Viaje[] = [];

  constructor() {
    // Cargar viajes desde localStorage si existen
    const storedViajes = localStorage.getItem('viajes');
    if (storedViajes) {
      this.viajes = JSON.parse(storedViajes);
    }
  }

  // Método para guardar los viajes en localStorage
  private saveViajes() {
    localStorage.setItem('viajes', JSON.stringify(this.viajes));
  }

  // Programar un nuevo viaje
  programarViaje(viaje: Viaje): Observable<Viaje> {
    const nuevoViaje: Viaje = {
      ...viaje,
      id: this.viajes.length + 1,
      estado: 'disponible',
      pasajeros: [],
    };
    this.viajes.push(nuevoViaje);
    this.saveViajes();
    return of(nuevoViaje);
  }

  // Obtener todos los viajes programados por un conductor
  getViajesProgramados(conductorNombre: string): Observable<Viaje[]> {
    const viajesConductor = this.viajes.filter(
      (v) => v.conductorNombre === conductorNombre
    );
    return of(viajesConductor);
  }

  // Obtener viajes disponibles por conductor
  getViajesDisponibles(conductorNombre: string): Observable<Viaje[]> {
    const disponibles = this.viajes.filter(
      (v) =>
        v.conductorNombre === conductorNombre && v.estado === 'disponible'
    );
    return of(disponibles);
  }

  // Obtener viajes reservados por conductor
  getViajesReservados(conductorNombre: string): Observable<Viaje[]> {
    const reservados = this.viajes.filter(
      (v) =>
        v.conductorNombre === conductorNombre && v.estado === 'reservado'
    );
    return of(reservados);
  }

  // Obtener viajes completados por conductor
  getViajesCompletados(conductorNombre: string): Observable<Viaje[]> {
    const completados = this.viajes.filter(
      (v) =>
        v.conductorNombre === conductorNombre && v.estado === 'completado'
    );
    return of(completados);
  }

  // Obtener historial de viajes de un pasajero
  getHistorialViajes(username: string): Observable<Viaje[]> {
    const historial = this.viajes.filter((v) =>
      v.pasajeros.includes(username)
    );
    return of(historial);
  }

  // Reservar un viaje
  reservarViaje(viajeId: number, username: string): Observable<boolean> {
    const viaje = this.viajes.find((v) => v.id === viajeId);
    if (viaje && viaje.estado === 'disponible' && viaje.asientosDisponibles > 0) {
      viaje.estado = 'reservado';
      viaje.pasajeros.push(username);
      viaje.asientosDisponibles -= 1;
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  // Aceptar un viaje reservado
  aceptarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find((v) => v.id === viajeId);
    if (viaje && viaje.estado === 'reservado') {
      viaje.estado = 'aceptado';
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  // Cancelar un viaje reservado
  cancelarViaje(viajeId: number): Observable<boolean> {
    const viajeIndex = this.viajes.findIndex((v) => v.id === viajeId);
    if (viajeIndex !== -1) {
      const viaje = this.viajes[viajeIndex];
      if (viaje.estado === 'reservado' || viaje.estado === 'aceptado') {
        viaje.estado = 'cancelado';
        viaje.asientosDisponibles += viaje.pasajeros.length;
        viaje.pasajeros = [];
        this.saveViajes();
        return of(true);
      }
    }
    return of(false);
  }

  // Obtener estadísticas de un conductor
  getEstadisticasConductor(username: string): Promise<EstadisticasConductor> {
    return new Promise((resolve, reject) => {
      const viajesActivos = this.viajes.filter(
        (v) => v.conductorNombre === username && v.estado === 'aceptado'
      ).length;

      const totalPasajeros = this.viajes
        .filter((v) => v.conductorNombre === username)
        .reduce((acc, v) => acc + v.pasajeros.length, 0);

      resolve({ viajesActivos, totalPasajeros });
    });
  }

  // Obtener estadísticas de un pasajero
  getEstadisticasPasajero(username: string): Promise<EstadisticasPasajero> {
    return new Promise((resolve, reject) => {
      const viajesReservados = this.viajes.filter(
        (v) =>
          v.pasajeros.includes(username) && v.estado === 'reservado'
      ).length;

      const viajesCompletados = this.viajes.filter(
        (v) =>
          v.pasajeros.includes(username) && v.estado === 'completado'
      ).length;

      resolve({ viajesReservados, viajesCompletados });
    });
  }
}
