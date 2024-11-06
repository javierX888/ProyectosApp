import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { UserTypeGuard } from './guards/user-type.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // Rutas públicas
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (m) => m.ResetPasswordPageModule
      ),
  },
  // Rutas protegidas para conductores
  {
    path: 'conductor-dashboard',
    loadChildren: () =>
      import('./conductor-dashboard/conductor-dashboard.module').then(
        (m) => m.ConductorDashboardPageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'conductor' },
  },
  {
    path: 'programar-viaje',
    loadChildren: () =>
      import('./programar-viaje/programar-viaje.module').then(
        (m) => m.ProgramarViajePageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'conductor' },
  },
  {
    path: 'viajes-programados',
    loadChildren: () =>
      import('./viajes-programados/viajes-programados.module').then(
        (m) => m.ViajesProgramadosPageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'conductor' },
  },
  {
    path: 'historial-viajes',
    loadChildren: () =>
      import('./historial-viajes/historial-viajes.module').then(
        (m) => m.HistorialViajesPageModule
      ),
    canActivate: [AuthGuard],
  },
  // Rutas protegidas para pasajeros
  {
    path: 'pasajero-dashboard',
    loadChildren: () =>
      import('./pasajero-dashboard/pasajero-dashboard.module').then(
        (m) => m.PasajeroDashboardPageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'pasajero' },
  },
  {
    path: 'buscar-viaje',
    loadChildren: () =>
      import('./buscar-viaje/buscar-viaje.module').then(
        (m) => m.BuscarViajePageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'pasajero' },
  },
  {
    path: 'viajes-reservados',
    loadChildren: () =>
      import('./viajes-reservados/viajes-reservados.module').then(
        (m) => m.ViajesReservadosPageModule
      ),
    canActivate: [AuthGuard, UserTypeGuard],
    data: { userType: 'pasajero' },
  },
  // Ruta para manejar rutas no encontradas
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
