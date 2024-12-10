import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { Observable, throwError, from } from 'rxjs';
import { catchError, tap, switchMap, map } from 'rxjs/operators';

export interface VehicleData {
  modeloVehiculo: string;
  patente: string;
  licencia: string;
  capacidad?: number;
}

export interface ViajeData {
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  asientosDisponibles: number;
  precio: number;
  vehiculoId?: string;
  estado?: 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado';
}

export interface UserData {
  nombre: string;
  email: string;
  contraseña: string;
  tipo: 'conductor' | 'pasajero';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    tipo: 'conductor' | 'pasajero';
    nombre: string;
  };
}

export interface SearchFilters {
  origen?: string;
  destino?: string;
  fecha?: string;
  asientosMinimos?: number;
  precioMaximo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    const message = error.error?.message || 'Error en el servidor';
    return throwError(() => new Error(message));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    console.log('API URL:', this.apiUrl); // Añade esta línea
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/users/login`, {
      email,
      contraseña: password
    }).pipe(
      tap(response => this.saveToken(response.token)),
      catchError(this.handleError)
    );
  }  

  register(userData: UserData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/api/users/register`, userData).pipe(
      tap(response => this.saveToken(response.token)),
      catchError(this.handleError)
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/reset-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  saveToken(token: string): Observable<void> {
    return from(this.storage.set(this.TOKEN_KEY, token));
  }

  getToken(): Observable<string | null> {
    return from(this.storage.get(this.TOKEN_KEY));
  }

  clearToken(): Observable<void> {
    return from(this.storage.remove(this.TOKEN_KEY));
  }

  private getAuthHeaders(): Observable<HttpHeaders> {
    return this.getToken().pipe(
      map(token => new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }))
    );
  }

  logout(): Observable<void> {
    return this.clearToken();
  }

  getProfile(): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get(`${this.apiUrl}/api/users/profile`, { headers })),
      catchError(this.handleError)
    );
  }

  updateProfile(userData: Partial<UserData>): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.put(
        `${this.apiUrl}/users/profile`,
        userData,
        { headers }
      )),
      catchError(this.handleError)
    );
  }

  getVehicles(): Observable<VehicleData[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<VehicleData[]>(`${this.apiUrl}/vehicles`, { headers })),
      catchError(this.handleError)
    );
  }

  addVehicle(vehicleData: VehicleData): Observable<VehicleData> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.post<VehicleData>(
        `${this.apiUrl}/vehicles`,
        vehicleData,
        { headers }
      )),
      catchError(this.handleError)
    );
  }

  // MODIFICACIÓN AQUÍ: Añadimos un parámetro 'origen' opcional
  getAvailableViajes(origen?: string): Observable<ViajeData[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        const url = origen
          ? `${this.apiUrl}/viajes/disponibles?origen=${encodeURIComponent(origen)}`
          : `${this.apiUrl}/viajes/disponibles`;
        return this.http.get<ViajeData[]>(url, { headers });
      }),
      catchError(this.handleError)
    );
  }

  searchViajes(filters: SearchFilters): Observable<ViajeData[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<ViajeData[]>(
        `${this.apiUrl}/viajes/search`,
        { headers, params: { ...filters } }
      )),
      catchError(this.handleError)
    );
  }

  getViajesProgramados(conductorId: string): Observable<ViajeData[]> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get<ViajeData[]>(
        `${this.apiUrl}/viajes/programados/${conductorId}`,
        { headers }
      )),
      catchError(this.handleError)
    );
  }

  getEstadisticasConductor(conductorId: string): Observable<any> {
    return this.getAuthHeaders().pipe(
      switchMap(headers => this.http.get(
        `${this.apiUrl}/viajes/estadisticas/conductor/${conductorId}`,
        { headers }
      )),
      catchError(this.handleError)
    );
  }
}
