//UserTypeGuard: Debe encargarse de verificar el tipo de usuario
// src/app/guards/user-type.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserTypeGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    // Verificar si el usuario está autenticado
    console.log('UserTypeGuard: checking user type');
    if (!this.authService.isAuthenticated()) {
      await this.showToast('Por favor, inicia sesión para continuar.');
      this.router.navigate(['/login']);
      return false;
    }

    const requiredType = route.data['userType'];
    if (!requiredType) {
      return true; // Si no se especifica tipo requerido, permitir acceso
    }

    const userType = this.authService.getUserType();

    if (userType === requiredType) {
      return true;
    }

    // Si el tipo no coincide, mostrar mensaje y redirigir
    const message = `Acceso denegado. Esta sección es solo para ${requiredType}s.`;
    await this.showToast(message);

    // Redirigir al dashboard correspondiente según el tipo de usuario
    if (userType === 'conductor') {
      this.router.navigate(['/conductor-dashboard']);
    } else if (userType === 'pasajero') {
      this.router.navigate(['/pasajero-dashboard']);
    } else {
      this.router.navigate(['/login']);
    }

    return false;
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'warning',
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