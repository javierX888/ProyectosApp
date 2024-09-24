import { Component, OnInit } from '@angular/core';
import { ViajeService } from '../services/viaje.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-viajes-reservados',
  templateUrl: './viajes-reservados.page.html',
  styleUrls: ['./viajes-reservados.page.scss'],
})
export class ViajesReservadosPage implements OnInit {
  viajesReservados: any[] = [];

  constructor(
    private viajeService: ViajeService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarViajesReservados();
  }

  cargarViajesReservados() {
    // Asumiendo que tienes un método para obtener los viajes reservados
    this.viajeService.getViajesReservados().subscribe(
      viajes => this.viajesReservados = viajes
    );
  }

  async cancelarReserva(id: number) {
    const cancelado = await this.viajeService.cancelarReserva(id, 1).toPromise();
    if (cancelado) {
      await this.showToast('Reserva cancelada con éxito', 'success');
      this.cargarViajesReservados();
    } else {
      await this.showToast('Error al cancelar la reserva');
    }
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}