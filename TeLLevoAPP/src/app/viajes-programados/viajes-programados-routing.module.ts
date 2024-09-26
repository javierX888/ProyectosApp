import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajesProgramadosPage } from './viajes-programados.page';

const routes: Routes = [
  {
    path: '',
    component: ViajesProgramadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajesProgramadosPageRoutingModule {}
