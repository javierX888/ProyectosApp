import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BuscarViajePage } from './buscar-viaje.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BuscarViajePage', () => {
  let component: BuscarViajePage;
  let fixture: ComponentFixture<BuscarViajePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BuscarViajePage],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the BuscarViaje page component', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined method buscarViajes', () => {
    expect(component.buscarViajes).toBeDefined();
  });

  it('should have filtros property default values', () => {
    expect(component.filtros.sede).toBe('');
  });
});
