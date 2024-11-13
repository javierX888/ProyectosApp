// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private storage: Storage) {
    this.storage.create(); // Inicializa el almacenamiento de Ionic
  }

  // Login para obtener el token
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, {
      email,
      contraseña: password,
    });
  }

  // Guardar token en almacenamiento local
  async saveToken(token: string): Promise<void> {
    await this.storage.set('authToken', token);
  }

  // Obtener token del almacenamiento local
  async getToken(): Promise<string | null> {
    return await this.storage.get('authToken');
  }

  // Configurar encabezados de autorización
  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // RUTAS PROTEGIDAS PARA VEHÍCULOS

  // Agregar un vehículo
  async addVehicle(vehicleData: any): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/vehicles`, vehicleData, { headers });
  }

  // Obtener todos los vehículos del conductor
  async getVehicles(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/vehicles`, { headers });
  }

  // Eliminar un vehículo
  async deleteVehicle(vehicleId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/vehicles/${vehicleId}`, { headers });
  }

  // RUTAS PROTEGIDAS PARA VIAJES

  // Crear un viaje
  async createViaje(viajeData: any): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/viajes`, viajeData, { headers });
  }

  // Obtener viajes disponibles
  getAvailableViajes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/viajes/disponibles`);
  }

  // Reservar un viaje
  async reservarViaje(viajeId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/viajes/${viajeId}/reservar`, {}, { headers });
  }

  // Aceptar una reserva
  async aceptarReserva(viajeId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/viajes/${viajeId}/aceptar`, {}, { headers });
  }

  // Cancelar una reserva
  async cancelarReserva(viajeId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/viajes/${viajeId}/cancelar`, {}, { headers });
  }

  // Completar un viaje
  async completarViaje(viajeId: string): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/viajes/${viajeId}/completar`, {}, { headers });
  }

  // Obtener historial de viajes para pasajeros
  async getHistorialViajes(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/viajes/historial`, { headers });
  }

  // Obtener estadísticas para el conductor
  async getEstadisticasConductor(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/viajes/estadisticas/conductor`, { headers });
  }

  // Obtener estadísticas para el pasajero
  async getEstadisticasPasajero(): Promise<Observable<any>> {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/viajes/estadisticas/pasajero`, { headers });
  }
}
