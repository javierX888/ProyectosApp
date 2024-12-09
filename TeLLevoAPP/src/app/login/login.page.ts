import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

// interfaz LoginResponse
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    tipo: 'conductor' | 'pasajero';
  };
}

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
    private apiService: ApiService,
    private authService: AuthService, // Añadido
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController // Añadido
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Métodos 
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

  async onLogin() {
    if (this.loginForm.invalid) {
      await this.showToast('Por favor, complete todos los campos correctamente');
      return;
    }
  
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    await loading.present();
  
    try {
      const { username, password } = this.loginForm.value;
      console.log('Login Page - Starting login process');
      
      const success = await this.authService.login(username, password);
      await loading.dismiss();
  
      if (success) {
        console.log('Login Page - Login successful');
        const userType = this.authService.getUserType();
        console.log('Login Page - User type:', userType);
        
        switch(userType) {
          case 'conductor':
            this.router.navigate(['/conductor-dashboard']);
            break;
          case 'pasajero':
            this.router.navigate(['/pasajero-dashboard']);
            break;
          default:
            console.error('Login Page - Unexpected user type:', userType);
            await this.showToast('Tipo de usuario no válido', 'danger');
        }
      }
    } catch (error: any) {
      console.error('Login Page - Error:', error);
      await loading.dismiss();
      await this.showToast(error.message || 'Error en el inicio de sesión', 'danger');
    }
  }
}