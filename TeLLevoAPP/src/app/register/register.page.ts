import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

// Definir la interfaz OtrosDatos
interface OtrosDatos {
  licencia?: string;
  modeloVehiculo?: string;
  patente?: string;
  vehicles?: any[];
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[a-z0-9._%+-]+@duocuc\.cl$/),
          ],
        ],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        tipo: ['pasajero', Validators.required],
        licencia: [''],
        modeloVehiculo: [''],
        patente: [''],
      },
      { validator: this.passwordsMatchValidator }
    );

    // Escuchar cambios en el tipo de usuario para agregar/quitar validaciones
    this.registerForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'conductor') {
        this.registerForm.get('licencia')?.setValidators([Validators.required]);
        this.registerForm.get('modeloVehiculo')?.setValidators([Validators.required]);
        this.registerForm.get('patente')?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Z]{2}[A-Z0-9]{2}[0-9]{2}$/),
        ]);
      } else {
        this.registerForm.get('licencia')?.clearValidators();
        this.registerForm.get('modeloVehiculo')?.clearValidators();
        this.registerForm.get('patente')?.clearValidators();
      }
      this.registerForm.get('licencia')?.updateValueAndValidity();
      this.registerForm.get('modeloVehiculo')?.updateValueAndValidity();
      this.registerForm.get('patente')?.updateValueAndValidity();
    });
  }

  passwordsMatchValidator(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      await this.showToast('Por favor, complete todos los campos correctamente');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
    });
    await loading.present();

    const formData = this.registerForm.value;

    try {
      const otrosDatos: OtrosDatos = {};
      if (formData.tipo === 'conductor') {
        otrosDatos.vehicles = [
          {
            licencia: formData.licencia,
            modeloVehiculo: formData.modeloVehiculo,
            patente: formData.patente
          }
        ];
      }

      const success = await this.authService.register(
        formData.email,
        formData.password,
        formData.tipo,
        formData.nombre,
        otrosDatos
      );
      await loading.dismiss();
      if (success) {
        await this.showToast('Registro exitoso', 'success');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(
        error.message || 'Error al registrar usuario',
        'danger'
      );
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}