import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private viajesDisponibles: any[] = [];
  private viajesProgramados: any[] = [];

  constructor(private http: HttpClient) { }

  getViajesDisponibles(): Observable<any[]> {
    return of(this.viajesDisponibles);
  }

  getViajesProgramados(): Observable<any[]> {
    return of(this.viajesProgramados);
  }

  programarViaje(viaje: any): Observable<any> {
    const nuevoViaje = { ...viaje, id: this.viajesProgramados.length + 1 };
    this.viajesProgramados.push(nuevoViaje);
    this.viajesDisponibles.push(nuevoViaje);
    return of(nuevoViaje);
  }

  reservarViaje(viajeId: number, userId: number): Observable<any> {
    const viaje = this.viajesDisponibles.find(v => v.id === viajeId);
    if (viaje && viaje.asientosDisponibles > 0) {
      viaje.asientosDisponibles--;
      return of(viaje);
    }
    return of(null);
  }

  cancelarReserva(viajeId: number, userId: number): Observable<any> {
    const viaje = this.viajesDisponibles.find(v => v.id === viajeId);
    if (viaje) {
      viaje.asientosDisponibles++;
      return of(viaje);
    }
    return of(null);
  }

  getViajesReservados(): Observable<any[]> {
    // Implementa la lógica para obtener los viajes reservados
    return of([]);
  }

  getHistorialViajes(): Observable<any[]> {
    // Implementa la lógica para obtener el historial de viajes
    return of([]);
  }
}