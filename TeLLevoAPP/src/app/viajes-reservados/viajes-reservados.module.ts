import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesReservadosPageRoutingModule } from './viajes-reservados-routing.module';

import { ViajesReservadosPage } from './viajes-reservados.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajesReservadosPageRoutingModule
  ],
  declarations: [ViajesReservadosPage]
})
export class ViajesReservadosPageModule {}
