import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any;

  constructor(private toastController: ToastController) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  async login(username: string, password: string): Promise<any> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) => u.username === username && u.password === password
    );

    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user)); // Guarda el usuario en localStorage
      return user;
    } else {
      await this.showToast('Usuario o contraseña incorrectos', 'danger');
      return null;
    }
  }

  async register(username: string, password: string, userType: string, nombre: string, otrosDatos: any = {}): Promise<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.username === username)) {
      await this.showToast('El nombre de usuario ya existe', 'danger');
      return false;
    }

    const newUser = { username, password, tipo: userType, nombre, ...otrosDatos };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser)); // Guarda el usuario actual

    this.currentUser = newUser;
    return true;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser'); // Remueve el usuario de localStorage
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getUserType(): string {
    return this.currentUser ? this.currentUser.tipo : '';
  }

  getUsername(): string {
    return this.currentUser ? this.currentUser.username : '';
  }

  getUserId(): number | null {
    return this.currentUser ? this.currentUser.id : null;
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  getNombre(): string {
    return this.currentUser ? this.currentUser.nombre : '';
  }

  // Métodos para manejar vehículos
  getVehicles(): any[] {
    return this.currentUser && this.currentUser.vehicles ? this.currentUser.vehicles : [];
  }

  addVehicle(vehicle: any): void {
    if (!this.currentUser.vehicles) {
      this.currentUser.vehicles = [];
    }
    this.currentUser.vehicles.push(vehicle);
    // Actualizar el usuario en localStorage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    // Actualizar el usuario en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u: any) => u.username === this.currentUser.username);
    if (index !== -1) {
      users[index] = this.currentUser;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }

  async resetPassword(email: string): Promise<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === email);

    if (user) {
      await this.showToast(
        'Se ha enviado un correo con instrucciones para restablecer tu contraseña',
        'success'
      );
      return true;
    } else {
      await this.showToast(
        'No se encontró ninguna cuenta asociada a este correo electrónico',
        'danger'
      );
      return false;
    }
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    await toast.present();
  }
}
