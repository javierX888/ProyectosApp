import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      await this.showToast('Por favor, complete todos los campos correctamente');
      return;
    }

    const { username, password } = this.loginForm.value;
    try {
      const user = await this.authService.login(username, password);
      if (user) {
        const userType = this.authService.getUserType();
        if (userType === 'conductor') {
          this.router.navigate(['/conductor-dashboard']);
        } else if (userType === 'pasajero') {
          this.router.navigate(['/pasajero-dashboard']);
        } else {
          await this.showToast('Tipo de usuario desconocido', 'danger');
          this.router.navigate(['/home']);
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.showToast('Error al iniciar sesión');
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  private async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}