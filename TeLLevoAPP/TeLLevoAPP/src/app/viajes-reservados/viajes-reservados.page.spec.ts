import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajesReservadosPage } from './viajes-reservados.page';

describe('ViajesReservadosPage', () => {
  let component: ViajesReservadosPage;
  let fixture: ComponentFixture<ViajesReservadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesReservadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
