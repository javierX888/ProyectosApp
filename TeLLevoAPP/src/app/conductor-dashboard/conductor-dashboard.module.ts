import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { ConductorDashboardPageRoutingModule } from './conductor-dashboard-routing.module';
import { ConductorDashboardPage } from './conductor-dashboard.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Añade ReactiveFormsModule aquí
    IonicModule,
    ConductorDashboardPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ConductorDashboardPage
  ]
})
export class ConductorDashboardPageModule {}
