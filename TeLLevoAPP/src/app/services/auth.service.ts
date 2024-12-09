import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  tipo: 'conductor' | 'pasajero';
  otrosDatos?: any;
}

interface User {
  id: string;
  email: string;
  tipo: 'conductor' | 'pasajero';
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private apiService: ApiService,
    private toastController: ToastController
  ) {
    this.initializeStorage();
  }

  private async initializeStorage(): Promise<void> {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
      await this.loadStoredUser();
    } catch (error) {
      console.error('Error inicializando storage:', error);
    }
  }

  private async loadStoredUser(): Promise<void> {
    const token = await this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.currentUserSubject.next({
          id: payload.id,
          email: payload.email,
          tipo: payload.tipo,
          nombre: payload.nombre
        });
      }
    }
  }

  public async getToken(): Promise<string | null> {
    return firstValueFrom(this.apiService.getToken());
  }

  public decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.apiService.login(username, password));
      console.log('Login response:', response); // Debug
  
      if (!response || !response.user || !response.token) {
        throw new Error('Respuesta de login inválida');
      }
  
      const user: User = {
        id: response.user.id || '',
        email: response.user.email || username,
        tipo: response.user.tipo || 'pasajero',
        nombre: response.user.nombre || username
      };
      
      this.currentUserSubject.next(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      await this.showToast('Inicio de sesión exitoso');
      return true;
    } catch (error) {
      console.error('Login error:', error); // Debug
      const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
      await this.showToast(errorMessage, 'danger');
      return false;
    }
  }

  async register(userData: RegisterData): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.apiService.register({
        nombre: userData.nombre,
        email: userData.email,
        contraseña: userData.password,
        tipo: userData.tipo,
        ...userData.otrosDatos
      }));

      await this.showToast('Registro exitoso');
      return true;
    } catch (error: any) {
      await this.showToast(error.message || 'Error en el registro', 'danger');
      return false;
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    try {
      await firstValueFrom(this.apiService.resetPassword(email));
      await this.showToast('Instrucciones enviadas al correo');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al restablecer contraseña';
      await this.showToast(errorMessage, 'danger');
      return false;
    }
  }

  async logout(): Promise<void> {
    await firstValueFrom(this.apiService.logout());
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    await this.showToast('Sesión cerrada');
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserType(): string {
    return this.currentUserSubject.value?.tipo || '';
  }

  getUserEmail(): string {
    return this.currentUserSubject.value?.email || '';
  }

  getNombre(): string {
    return this.currentUserSubject.value?.nombre || '';
  }

  getUsername(): string {
    return this.getUserEmail();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async getVehicles(): Promise<any[]> {
    try {
      return await firstValueFrom(this.apiService.getVehicles());
    } catch (error) {
      console.error('Error obteniendo vehículos:', error);
      await this.showToast('Error al obtener vehículos', 'danger');
      return [];
    }
  }

  async addVehicle(vehicle: any): Promise<boolean> {
    try {
      await firstValueFrom(this.apiService.addVehicle(vehicle));
      await this.loadStoredUser();
      await this.showToast('Vehículo agregado exitosamente');
      return true;
    } catch (error) {
      await this.showToast('Error al agregar vehículo', 'danger');
      return false;
    }
  }

  private async showToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}