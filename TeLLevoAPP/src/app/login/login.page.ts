import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  // Variables para almacenar el nombre de usuario y contraseña
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  // Método que se ejecuta al enviar el formulario de inicio de sesión
  async onSubmit() {
    if (!this.username || !this.password) {
      this.showToast('Por favor, ingrese usuario y contraseña', 'danger');
      return;
    }

    const isAuthenticated = await this.authService.login(this.username, this.password);

    if (isAuthenticated) {
      const userType = this.authService.getUserType();
      // Mostrar mensaje de éxito en verde claro
      this.showToast('Inicio de sesión exitoso', 'success');
      if (userType === 'conductor') {
        this.router.navigate(['/conductor-dashboard']);
      } else {
        this.router.navigate(['/pasajero-dashboard']);
      }
    } else {
      this.showToast('Usuario o contraseña incorrectos', 'danger');
    }
  }

  // Navegar a la página de restablecer contraseña
  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  // Navegar a la página de registro
  goToRegister() {
    this.router.navigate(['/register']);
  }

  // Método para mostrar mensajes toast
  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}