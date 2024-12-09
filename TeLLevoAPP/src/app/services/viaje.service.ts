import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Conductor {
  id: string;
  nombre: string;
  email: string;
}

export interface Vehiculo {
  id: string;
  modeloVehiculo: string;
  patente: string;
}

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora?: string; // Opcional si usas hora
  asientosDisponibles: number;
  precio: number;
  conductor?: string;
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
  private apiUrl = environment.apiUrl; // Añadimos la URL de la API

  constructor(
    private http: HttpClient
  ) {
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

  // Programar un nuevo viaje (Local)
  programarViaje(viaje: Viaje): Observable<Viaje> {
    // Asumiendo que 'viaje' contiene origen, destino, fecha, hora, asientosDisponibles, precio, vehiculoId
    return this.http.post<Viaje>(`${this.apiUrl}/viajes`, viaje).pipe(
      tap(viajeCreado => {
        // Opcional: Actualizar el array local
        this.viajes.push(viajeCreado);
        this.saveViajes();
      }),
      catchError(error => {
        console.error('Error al crear viaje en el backend:', error);
        return of(null as unknown as Viaje);
      })
    );
  }  

  // Obtener todos los viajes programados por un conductor (Local)
  getViajesProgramados(conductorNombre: string): Observable<Viaje[]> {
    const viajesConductor = this.viajes.filter(
      (v) => v.conductorNombre === conductorNombre
    );
    return of(viajesConductor);
  }

  getViajesDisponibles(conductorNombre: string): Observable<Viaje[]> {
    const disponibles = this.viajes.filter(
      (v) => v.conductorNombre === conductorNombre && v.estado === 'disponible'
    );
    return of(disponibles);
  }
  

  // Obtener viajes reservados por conductor (Local)
  getViajesReservados(conductorNombre: string): Observable<Viaje[]> {
    const reservados = this.viajes.filter(
      (v) =>
        v.conductorNombre === conductorNombre && v.estado === 'reservado'
    );
    return of(reservados);
  }

  // Obtener viajes completados por conductor (Local)
  getViajesCompletados(conductorNombre: string): Observable<Viaje[]> {
    const completados = this.viajes.filter(
      (v) =>
        v.conductorNombre === conductorNombre && v.estado === 'completado'
    );
    return of(completados);
  }

  // Obtener historial de viajes de un pasajero (usa API)
  getHistorialViajes(userId: string): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/viajes/historial/${userId}`).pipe(
      tap((viajes: Viaje[]) => {
        console.log('Viajes obtenidos:', viajes);
        // Actualizamos el almacenamiento local
        this.viajes = [...this.viajes, ...viajes];
        this.saveViajes();
      }),
      catchError((error: any) => {
        console.error('Error al obtener historial:', error);
        // En caso de error, devolvemos los viajes del almacenamiento local
        const viajesLocales = this.viajes.filter(v =>
          v.pasajeros.includes(userId) || v.conductorNombre === userId
        );
        return of(viajesLocales);
      })
    );
  }

  // Reservar un viaje (Local)
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

  // Aceptar un viaje reservado (Local)
  aceptarViaje(viajeId: number): Observable<boolean> {
    const viaje = this.viajes.find((v) => v.id === viajeId);
    if (viaje && viaje.estado === 'reservado') {
      viaje.estado = 'aceptado';
      this.saveViajes();
      return of(true);
    }
    return of(false);
  }

  // Cancelar un viaje reservado (Local)
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

  // Obtener estadísticas de un conductor (Local)
  getEstadisticasConductor(username: string): Promise<EstadisticasConductor> {
    return new Promise((resolve) => {
      const viajesActivos = this.viajes.filter(
        (v) => v.conductorNombre === username && v.estado === 'aceptado'
      ).length;

      const totalPasajeros = this.viajes
        .filter((v) => v.conductorNombre === username)
        .reduce((acc, v) => acc + v.pasajeros.length, 0);

      resolve({ viajesActivos, totalPasajeros });
    });
  }

  // Obtener estadísticas de un pasajero (Local)
  getEstadisticasPasajero(username: string): Promise<EstadisticasPasajero> {
    return new Promise((resolve) => {
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

  // *** NUEVO MÉTODO PARA OBTENER VIAJES DESDE LA API POR ORIGEN ***
  getViajesPorOrigen(origen: string): Observable<Viaje[]> {
    const url = origen 
      ? `${this.apiUrl}/viajes/disponibles?origen=${encodeURIComponent(origen)}`
      : `${this.apiUrl}/viajes/disponibles`;

    return this.http.get<Viaje[]>(url).pipe(
      tap((viajes: Viaje[]) => {
        console.log('Viajes obtenidos desde la API:', viajes);
        // Opcional: Guardar en localStorage
        this.viajes = viajes;
        this.saveViajes();
      }),
      catchError((error: any) => {
        console.error('Error al obtener viajes por origen:', error);
        return of([]);
      })
    );
  }
}
