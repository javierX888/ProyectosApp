import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesProgramadosPageRoutingModule } from './viajes-programados-routing.module';

import { ViajesProgramadosPage } from './viajes-programados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesProgramadosPageRoutingModule
  ],
  declarations: [ViajesProgramadosPage]
})
export class ViajesProgramadosPageModule {}
