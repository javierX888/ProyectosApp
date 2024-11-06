import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora?: string; // Si usas hora
  asientosDisponibles: number;
  precio: number;
  conductorNombre: string;
  patente?: string;
  vehiculo: any;
  conductor: string;
  estado: 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado';
  pasajeros: string[];
  pasajeroNombre?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  private viajes: Viaje[] = [];

  constructor() {
    // Cargar viajes desde localStorage si es necesario
    const storedViajes = localStorage.getItem('viajes');
    if (storedViajes) {
      this.viajes = JSON.parse(storedViajes);
    }
  }

  programarViaje(viaje: Viaje): Observable<Viaje> {
    const nuevoViaje: Viaje = { 
      ...viaje, 
      id: this.viajes.length + 1, 
      estado: 'disponible',
      pasajeros: []
    };
    this.viajes.push(nuevoViaje);
    this.saveViajes();
    return of(nuevoViaje);
  }

  getViajesDisponibles(): Observable<Viaje[]> {
    return of(this.viajes.filter(v => v.estado === 'disponible'));
  }

  getViajesProgramados(conductorNombre: string): Observable<Viaje[]> {
    const viajesConductor = this.viajes.filter(v => v.conductorNombre === conductorNombre);
    return of(viajesConductor);
  }

  getViajesReservados(pasajeroNombre: string): Observable<Viaje[]> {
    return of(this.viajes.filter(v => v.pasajeroNombre === pasajeroNombre && v.estado === 'reservado'));
  }

  getHistorialViajes(username: string): Observable<Viaje[]> {
    return of(this.viajes.filter(v => 
      (v.conductorNombre === username || v.pasajeroNombre === username) && 
      ['reservado', 'aceptado', 'cancelado', 'completado'].includes(v.estado)
    ));
  }

  getEstadisticasConductor(conductorNombre: string): Promise<{ viajesActivos: number; totalPasajeros: number }> {
    const viajesActivos = this.viajes.filter(v => v.conductorNombre === conductorNombre && v.estado === 'disponible').length;
    const totalPasajeros = this.viajes
      .filter(v => v.conductorNombre === conductorNombre)
      .reduce((acc, v) => acc + v.pasajeros.length, 0);
    return Promise.resolve({ viajesActivos, totalPasajeros });
  }  

  getEstadisticasPasajero(pasajeroNombre: string): Promise<{ viajesReservados: number; viajesCompletados: number }> {
    const viajesReservados = this.viajes.filter(v => v.pasajeroNombre === pasajeroNombre && v.estado === 'reservado').length;
    const viajesCompletados = this.viajes.filter(v => v.pasajeroNombre === pasajeroNombre && v.estado === 'completado').length;
    return Promise.resolve({ viajesReservados, viajesCompletados });
  }

  reservarViaje(viajeId: number, pasajeroNombre: string): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && viaje.asientosDisponibles > 0) {
      viaje.asientosDisponibles--;
      viaje.pasajeroNombre = pasajeroNombre;
      viaje.estado = 'reservado';
      viaje.pasajeros.push(pasajeroNombre);
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  aceptarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && viaje.estado === 'reservado') {
      viaje.estado = 'aceptado';
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  cancelarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && (viaje.estado === 'reservado' || viaje.estado === 'aceptado')) {
      viaje.estado = 'cancelado';
      const pasajeroNombre = viaje.pasajeroNombre; // Guarda el nombre antes de eliminarlo
      viaje.pasajeroNombre = undefined;
      viaje.asientosDisponibles++;
      viaje.pasajeros = viaje.pasajeros.filter(nombre => nombre !== pasajeroNombre);
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  private saveViajes() {
    localStorage.setItem('viajes', JSON.stringify(this.viajes));
  }
}
