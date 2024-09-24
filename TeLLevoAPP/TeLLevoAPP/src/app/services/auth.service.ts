import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() { }

  async login(username: string, password: string): Promise<boolean> {
    // Aquí deberías implementar la lógica real de autenticación
    // Por ahora, simplemente simularemos un login exitoso
    this.currentUser = { username, userType: 'pasajero' };
    return true;
  }

  async register(username: string, password: string, userType: string): Promise<boolean> {
    // Aquí deberías implementar la lógica real de registro
    // Por ahora, simplemente simularemos un registro exitoso
    return true;
  }

  logout() {
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getUserType(): string {
    return this.currentUser ? this.currentUser.userType : '';
  }

  getUsername(): string {
    return this.currentUser ? this.currentUser.username : '';
  }

  async resetPassword(email: string): Promise<boolean> {
    // Aquí deberías implementar la lógica real de restablecimiento de contraseña
    // Por ahora, simplemente simularemos un restablecimiento exitoso
    return true;
  }
}