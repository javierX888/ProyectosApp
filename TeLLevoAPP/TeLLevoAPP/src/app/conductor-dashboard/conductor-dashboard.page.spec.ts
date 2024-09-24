import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConductorDashboardPage } from './conductor-dashboard.page';

describe('ConductorDashboardPage', () => {
  let component: ConductorDashboardPage;
  let fixture: ComponentFixture<ConductorDashboardPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConductorDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
