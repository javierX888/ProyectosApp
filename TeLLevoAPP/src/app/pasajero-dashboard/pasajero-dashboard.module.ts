import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasajeroDashboardPageRoutingModule } from './pasajero-dashboard-routing.module';

import { PasajeroDashboardPage } from './pasajero-dashboard.page';

import { ViajesPasajeroComponent } from '../viajes-pasajero.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajeroDashboardPageRoutingModule
  ],
  declarations: [
    PasajeroDashboardPage,
    ViajesPasajeroComponent
  ],
})
export class PasajeroDashboardPageModule {}
