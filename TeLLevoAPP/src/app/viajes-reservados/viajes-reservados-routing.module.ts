import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajesReservadosPage } from './viajes-reservados.page';

const routes: Routes = [
  {
    path: '',
    component: ViajesReservadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajesReservadosPageRoutingModule {}
