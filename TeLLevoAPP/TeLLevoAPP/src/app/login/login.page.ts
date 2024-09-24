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
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  async onSubmit() {
    if (!this.username || !this.password) {
      this.showToast('Por favor, ingrese usuario y contraseña');
      return;
    }

    const isAuthenticated = await this.authService.login(this.username, this.password);

    if (isAuthenticated) {
      const userType = this.authService.getUserType();
      if (userType === 'conductor') {
        this.router.navigate(['/conductor-dashboard']);
      } else {
        this.router.navigate(['/pasajero-dashboard']);
      }
    } else {
      this.showToast('Usuario o contraseña incorrectos');
    }
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}