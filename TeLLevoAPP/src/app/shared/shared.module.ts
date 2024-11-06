import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ViajesConductorComponent } from '../viajes-conductor.component';
import { ViajesPasajeroComponent } from '../viajes-pasajero.component';

@NgModule({
  declarations: [
    ViajesConductorComponent,
    ViajesPasajeroComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ViajesConductorComponent,
    ViajesPasajeroComponent
  ]
})
export class SharedModule {}
