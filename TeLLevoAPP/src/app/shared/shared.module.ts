// src/app/shared/shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ViajesPasajeroComponent } from '../components/viajes-pasajero/viajes-pasajero.component';

@NgModule({
  declarations: [
    ViajesPasajeroComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ViajesPasajeroComponent,
    CommonModule,
    IonicModule
  ]
})
export class SharedModule { }