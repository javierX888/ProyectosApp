import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) { }

  async resetPassword() {
    if (this.email) {
      const reset = await this.authService.resetPassword(this.email);
      if (reset) {
        await this.showToast('Se ha enviado un correo para restablecer tu contraseña', 'success');
        this.router.navigate(['/login']);
      } else {
        await this.showToast('Error al restablecer la contraseña');
      }
    } else {
      await this.showToast('Por favor, ingresa un correo electrónico válido');
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}