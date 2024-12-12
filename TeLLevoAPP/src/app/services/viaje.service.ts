import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Viaje } from '../interfaces/viaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(private http: HttpClient) {}

  async getViajes(): Promise<Viaje[]> {
    try {
      const viajes = await this.http.get<Viaje[]>(`${environment.apiUrl}/viajes`).toPromise();
      return viajes ?? [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  getViajesDisponibles(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${environment.apiUrl}/viajes/disponibles`).pipe(
      map(viajes => viajes ?? []),
      catchError(error => {
        console.error('Error:', error);
        return of([]);
      })
    );
  }

  getEstadisticasConductor(username: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/conductor/${username}/estadisticas`);
  }

  getEstadisticasPasajero(email: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/pasajero/${email}/estadisticas`);
  }

  getViajesProgramados(username: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${environment.apiUrl}/conductor/${username}/viajes`).pipe(
      map(viajes => viajes ?? [])
    );
  }

  getViajesReservados(email: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${environment.apiUrl}/pasajero/${email}/viajes`);
  }

  getHistorialViajes(username: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${environment.apiUrl}/viajes/historial/${username}`);
  }

  getViajesCompletados(username: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${environment.apiUrl}/viajes/completados/${username}`);
  }

  programarViaje(viaje: Viaje): Observable<Viaje> {
    return this.http.post<Viaje>(`${environment.apiUrl}/viajes`, viaje);
  }

  reservarViaje(viajeId: number, pasajeroId: string): Observable<Viaje> {
    return this.http.post<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/reservar`, { pasajeroId });
  }

  aceptarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/aceptar`, {});
  }

  completarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/completar`, {});
  }

  cancelarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/cancelar`, {});
  }
}