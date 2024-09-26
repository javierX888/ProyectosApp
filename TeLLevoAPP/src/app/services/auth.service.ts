import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor(private toastController: ToastController) { }

  async login(username: string, password: string): Promise<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      this.currentUser = user;
      await this.showToast('Inicio de sesión exitoso', 'success');
      return true;
    }
    await this.showToast('Usuario o contraseña incorrectos', 'danger');
    return false;
  }

  async register(username: string, password: string, userType: string): Promise<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: any) => u.username === username)) {
      await this.showToast('El nombre de usuario ya existe', 'danger');
      return false;
    }
    
    const newUser = { username, password, userType };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    await this.showToast(`Registro exitoso como ${userType}`, 'success');
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

  getUserId(): number {
    return this.currentUser ? this.currentUser.id : null;
  }

  async resetPassword(email: string): Promise<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === email);
    
    if (user) {
      await this.showToast('Se ha enviado un correo con instrucciones para restablecer tu contraseña', 'success');
      return true;
    } else {
      await this.showToast('No se encontró ninguna cuenta asociada a este correo electrónico', 'danger');
      return false;
    }
  }

  private async showToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}