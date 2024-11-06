//AuthGuard: Debe encargarse únicamente de verificar si el usuario está autenticado.
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async canActivate(): Promise<boolean> {
    console.log('AuthGuard: checking authentication');
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      await this.showToast('Por favor, inicia sesión para continuar.');
      this.router.navigate(['/login']);
      return false;
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      buttons: [
        {
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  }
}