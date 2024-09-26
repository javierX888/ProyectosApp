import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  asientosDisponibles: number;
  precio: number;
  conductorNombre?: string;
  pasajeroNombre?: string;
  patente?: string;
  estado: 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado';
}

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private viajes: Viaje[] = [];

  constructor() {
    this.viajes = [
      { id: 1, origen: 'Santiago', destino: 'Viña del Mar', fecha: '2024-09-25', hora: '20:30', asientosDisponibles: 3, precio: 5000, conductorNombre: 'Juan Pérez', patente: 'ABC123', estado: 'disponible' },
      { id: 2, origen: 'Valparaíso', destino: 'Santiago', fecha: '2024-09-26', hora: '21:00', asientosDisponibles: 2, precio: 4500, conductorNombre: 'María González', patente: 'XYZ789', estado: 'disponible' }
    ];
  }

  getViajesDisponibles(): Observable<Viaje[]> {
    return of(this.viajes.filter(v => v.estado === 'disponible'));
  }

  getViajesProgramados(conductorNombre: string): Observable<Viaje[]> {
    return of(this.viajes.filter(v => v.conductorNombre === conductorNombre && v.estado === 'disponible'));
  }

  getViajesReservados(pasajeroNombre: string): Observable<Viaje[]> {
    return of(this.viajes.filter(v => v.pasajeroNombre === pasajeroNombre && v.estado === 'reservado'));
  }

  programarViaje(viaje: Viaje): Observable<Viaje> {
    const nuevoViaje: Viaje = { ...viaje, id: this.viajes.length + 1, estado: 'disponible' };
    this.viajes.push(nuevoViaje);
    return of(nuevoViaje);
  }

  getHistorialViajes(username: string): Observable<Viaje[]> {
    return of(this.viajes.filter(v => 
      (v.conductorNombre === username || v.pasajeroNombre === username) && 
      ['reservado', 'aceptado', 'cancelado', 'completado'].includes(v.estado)
    ));
  }

  reservarViaje(viajeId: number, pasajeroNombre: string): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && viaje.asientosDisponibles > 0) {
      viaje.asientosDisponibles--;
      viaje.pasajeroNombre = pasajeroNombre;
      viaje.estado = 'reservado';
      return of(true);
    }
    return of(false);
  }

  aceptarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && viaje.estado === 'reservado') {
      viaje.estado = 'aceptado';
      return of(true);
    }
    return of(false);
  }

  cancelarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find(v => v.id === viajeId);
    if (viaje && (viaje.estado === 'reservado' || viaje.estado === 'aceptado')) {
      viaje.estado = 'cancelado';
      viaje.pasajeroNombre = undefined;
      viaje.asientosDisponibles++;
      return of(true);
    }
    return of(false);
  }
}