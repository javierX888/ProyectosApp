import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

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
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
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

  async onLogin() {
    if (this.loginForm.valid) {
      let loading: HTMLIonLoadingElement | null = null;
      try {
        loading = await this.loadingController.create({
          message: 'Iniciando sesión...'
        });
        await loading.present();

        const { username, password } = this.loginForm.value;
        console.log('Intentando login con:', { email: username });
        
        const response = await this.authService.login(username, password).toPromise();
        console.log('Respuesta del servidor:', response);

        if (response && response.token) {
          const userType = response.user?.tipo;
          console.log('Tipo de usuario:', userType);
          
          if (userType === 'conductor' || userType === 'pasajero') {
            await this.router.navigate([`/${userType}-dashboard`]);
          } else {
            await this.presentToast('Tipo de usuario no válido');
          }
        }
      } catch (error: any) {
        console.error('Error en login:', error);
        await this.presentToast(error.error?.message || 'Error al iniciar sesión');
      } finally {
        if (loading) {
          await loading.dismiss();
        }
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}