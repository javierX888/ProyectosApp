import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConductorDashboardPageRoutingModule } from './conductor-dashboard-routing.module';
import { ConductorDashboardPage } from './conductor-dashboard.page';
import { ViajesConductorComponent } from '../viajes-conductor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConductorDashboardPageRoutingModule
  ],
  declarations: [ConductorDashboardPage, ViajesConductorComponent]
})
export class ConductorDashboardPageModule {}