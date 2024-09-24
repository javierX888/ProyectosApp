import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  userType: string = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  async onSubmit() {
    if (!this.username || !this.password || !this.confirmPassword || !this.userType) {
      await this.showToast('Por favor, complete todos los campos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden');
      return;
    }

    const registered = await this.authService.register(this.username, this.password, this.userType);
    if (registered) {
      await this.showToast('Registro exitoso', 'success');
      this.router.navigate(['/login']);
    } else {
      await this.showToast('Error en el registro');
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