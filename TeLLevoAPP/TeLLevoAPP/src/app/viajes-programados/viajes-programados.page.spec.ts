import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajesProgramadosPage } from './viajes-programados.page';

describe('ViajesProgramadosPage', () => {
  let component: ViajesProgramadosPage;
  let fixture: ComponentFixture<ViajesProgramadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesProgramadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});