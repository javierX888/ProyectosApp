import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Asegúrate de importar ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { ProgramarViajePageRoutingModule } from './programar-viaje-routing.module';
import { ProgramarViajePage } from './programar-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- Añadir aquí
    IonicModule,
    ProgramarViajePageRoutingModule
  ],
  declarations: [ProgramarViajePage]
})
export class ProgramarViajePageModule {}
