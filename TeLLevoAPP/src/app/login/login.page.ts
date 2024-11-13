// src/app/login/login.page.ts

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service'; // Cambia AuthService a ApiService
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
    private apiService: ApiService, // Usa ApiService en lugar de AuthService
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
      // Llama al método de login en ApiService y obtiene el token
      const response = await this.apiService.login(username, password).toPromise();
      const token = response.token;

      // Guarda el token en el almacenamiento local
      await this.apiService.saveToken(token);

      // Opcional: Navega según el tipo de usuario, si es necesario
      const userType = this.decodeToken(token).tipo; // Decodifica el token para obtener el tipo de usuario
      if (userType === 'conductor') {
        this.router.navigate(['/conductor-dashboard']);
      } else if (userType === 'pasajero') {
        this.router.navigate(['/pasajero-dashboard']);
      } else {
        await this.showToast('Tipo de usuario desconocido', 'danger');
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.showToast('Error al iniciar sesión');
    }
  }

  // Decodifica el token para obtener información sobre el usuario
  private decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
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
