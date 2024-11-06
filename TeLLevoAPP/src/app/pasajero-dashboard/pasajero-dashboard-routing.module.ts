import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasajeroDashboardPage } from './pasajero-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: PasajeroDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasajeroDashboardPageRoutingModule {}