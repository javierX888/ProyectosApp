import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'conductor-dashboard',
    loadChildren: () => import('./conductor-dashboard/conductor-dashboard.module').then(m => m.ConductorDashboardPageModule)
  },
  {
    path: 'pasajero-dashboard',
    loadChildren: () => import('./pasajero-dashboard/pasajero-dashboard.module').then(m => m.PasajeroDashboardPageModule)
  },
  {
    path: 'programar-viaje',
    loadChildren: () => import('./programar-viaje/programar-viaje.module').then(m => m.ProgramarViajePageModule)
  },
  {
    path: 'buscar-viaje',
    loadChildren: () => import('./buscar-viaje/buscar-viaje.module').then(m => m.BuscarViajePageModule)
  },
  {
    path: 'viajes-programados',
    loadChildren: () => import('./viajes-programados/viajes-programados.module').then(m => m.ViajesProgramadosPageModule)
  },
  {
    path: 'viajes-reservados',
    loadChildren: () => import('./viajes-reservados/viajes-reservados.module').then(m => m.ViajesReservadosPageModule)
  },
  {
    path: 'historial-viajes',
    loadChildren: () => import('./historial-viajes/historial-viajes.module').then( m => m.HistorialViajesPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'programar-viaje',
    loadChildren: () => import('./programar-viaje/programar-viaje.module').then( m => m.ProgramarViajePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'conductor-dashboard',
    loadChildren: () => import('./conductor-dashboard/conductor-dashboard.module').then( m => m.ConductorDashboardPageModule)
  },
  {
    path: 'pasajero-dashboard',
    loadChildren: () => import('./pasajero-dashboard/pasajero-dashboard.module').then( m => m.PasajeroDashboardPageModule)
  },
  {
    path: 'buscar-viaje',
    loadChildren: () => import('./buscar-viaje/buscar-viaje.module').then( m => m.BuscarViajePageModule)
  },
  {
    path: 'viajes-programados',
    loadChildren: () => import('./viajes-programados/viajes-programados.module').then( m => m.ViajesProgramadosPageModule)
  },
  {
    path: 'viajes-reservados',
    loadChildren: () => import('./viajes-reservados/viajes-reservados.module').then( m => m.ViajesReservadosPageModule)
  },
  {
    path: 'historial-viajes',
    loadChildren: () => import('./historial-viajes/historial-viajes.module').then( m => m.HistorialViajesPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }