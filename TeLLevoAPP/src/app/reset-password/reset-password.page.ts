import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage {
  email: string = '';

  constructor(
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  async resetPassword() {
    if (!this.email.endsWith('@duocuc.cl')) {
      await this.showToast('Debe usar un correo &#64;duocuc.cl');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Enviando instrucciones...'
    });
    await loading.present();

    try {
      const success = await this.authService.resetPassword(this.email);
      await loading.dismiss();
      if (success) {
        await this.showToast('Se han enviado las instrucciones a tu correo', 'success');
        this.router.navigate(['/login']);
      } else {
        await this.showToast('No se pudo enviar el correo', 'danger');
      }
    } catch (error: any) { // Tipar error como any
      await loading.dismiss();
      await this.showToast(
        error.message || 'Error al enviar las instrucciones',
        'danger'
      );
    }
  }

  private async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}