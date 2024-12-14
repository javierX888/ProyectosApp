import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Viaje } from '../interfaces/viaje.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  private apiUrl = 'https://tellevoapp-api-production.up.railway.app/api';
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getViajes(): Promise<Viaje[]> {
    try {
      return await this.http.get<Viaje[]>(`${this.apiUrl}/viajes`).toPromise() || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  getEstadisticasPasajero(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pasajero/${email}/estadisticas`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return of(null);
      })
    );
  }
  
  getViajesDisponibles(): Promise<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/viajes/disponibles`)
      .pipe(
        map(viajes => viajes || [])
      )
      .toPromise()
      .then(viajes => viajes || []);
  }

  getEstadisticasConductor(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/conductor/${username}/estadisticas`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return of(null);
      })
    );
  }

  getViajesProgramados(): Observable<Viaje[]> {
    const userData = this.authService.currentUserValue;
    return this.http.get<Viaje[]>(`${this.apiUrl}/viajes/programados`, {
      headers: {
        'Authorization': `Bearer ${userData?.token}`
      }
    });
  }  

  getViajesReservados(email: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/pasajero/${email}/viajes`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return of([]);
      })
    );
  }

  getHistorialViajes(username: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/viajes/historial/${username}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        return of([]);
      })
    );
  }

  getViajesConductor(): Observable<Viaje[]> {
    const userData = this.authService.currentUserValue;
    return this.http.get<Viaje[]>(`${this.apiUrl}/viajes/conductor`, {
      headers: {
        'Authorization': `Bearer ${userData?.token || ''}`
      }
    });
  }  

  programarViaje(viaje: Viaje): Observable<Viaje> {
    return this.http.post<Viaje>(`${this.apiUrl}/viajes`, viaje).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error:', error);
        throw error;
      })
    );
  }

  reservarViaje(viajeId: number, pasajeroId: string): Observable<Viaje> {
    return this.http.post<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/reservar`, { pasajeroId });
  }

  aceptarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${environment.apiUrl}/viajes/${viajeId}/aceptar`, {});
  }

  completarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.apiUrl}/viajes/${viajeId}/completar`, {});
  }

  cancelarViaje(viajeId: number): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.apiUrl}/viajes/${viajeId}/cancelar`, {});
  }
}