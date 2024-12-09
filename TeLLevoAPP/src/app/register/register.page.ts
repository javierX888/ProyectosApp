import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

// Definimos la interfaz para los datos adicionales del registro
interface OtrosDatos {
  vehicles?: Array<{
    licencia: string;
    modeloVehiculo: string;
    patente: string;
  }>;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  // Formulario principal de registro
  registerForm: FormGroup;
  // Control de visibilidad de la contraseña
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {
    // Inicializamos el formulario con validaciones
    this.registerForm = this.fb.group(
      {
        // El nombre es requerido y debe tener al menos 3 caracteres
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        // El email debe ser un correo válido de duocuc.cl
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[a-z0-9._%+-]+@duocuc\.cl$/),
          ],
        ],
        // La contraseña debe tener al menos 6 caracteres
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        // Por defecto, el usuario se registra como pasajero
        tipo: ['pasajero', Validators.required],
        // Campos adicionales para conductores (inicialmente sin validación)
        licencia: [''],
        modeloVehiculo: [''],
        patente: [''],
      },
      { validator: this.passwordsMatchValidator }
    );

    // Escuchamos cambios en el tipo de usuario para ajustar validaciones
    this.registerForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      if (tipo === 'conductor') {
        // Si es conductor, agregamos validaciones para los campos de vehículo
        this.registerForm.get('licencia')?.setValidators([Validators.required]);
        this.registerForm.get('modeloVehiculo')?.setValidators([Validators.required]);
        this.registerForm.get('patente')?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Z]{2}[A-Z0-9]{2}[0-9]{2}$/),
        ]);
      } else {
        // Si es pasajero, removemos las validaciones
        this.registerForm.get('licencia')?.clearValidators();
        this.registerForm.get('modeloVehiculo')?.clearValidators();
        this.registerForm.get('patente')?.clearValidators();
      }
      // Actualizamos el estado de validación de los campos
      this.registerForm.get('licencia')?.updateValueAndValidity();
      this.registerForm.get('modeloVehiculo')?.updateValueAndValidity();
      this.registerForm.get('patente')?.updateValueAndValidity();
    });
  }

  // Validador personalizado para asegurar que las contraseñas coincidan
  passwordsMatchValidator(control: AbstractControl): void {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ passwordsMismatch: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
  }

  // Método principal para manejar el envío del formulario
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
      // Preparamos los datos adicionales según el tipo de usuario
      const otrosDatos: OtrosDatos = {};
      if (formData.tipo === 'conductor') {
        otrosDatos.vehicles = [{
          licencia: formData.licencia,
          modeloVehiculo: formData.modeloVehiculo,
          patente: formData.patente.toUpperCase()
        }];
      }

      // Intentamos registrar al usuario
      const success = await this.authService.register({
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        tipo: formData.tipo,
        otrosDatos
      });

      await loading.dismiss();

      if (success) {
        await this.showToast('Registro exitoso', 'success');
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      await loading.dismiss();
      await this.showToast(error.message || 'Error al registrar usuario', 'danger');
    }
  }

  // Método para alternar la visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Método utilitario para mostrar mensajes al usuario
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