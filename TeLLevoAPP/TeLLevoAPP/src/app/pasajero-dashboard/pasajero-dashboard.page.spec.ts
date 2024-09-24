import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasajeroDashboardPage } from './pasajero-dashboard.page';

describe('PasajeroDashboardPage', () => {
  let component: PasajeroDashboardPage;
  let fixture: ComponentFixture<PasajeroDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PasajeroDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
