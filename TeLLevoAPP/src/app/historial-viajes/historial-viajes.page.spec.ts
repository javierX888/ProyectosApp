import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HistorialViajesPage } from './historial-viajes.page';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { Viaje } from '../interfaces/viaje.interface';
import { of, throwError } from 'rxjs';

describe('HistorialViajesPage', () => {
  let component: HistorialViajesPage;
  let fixture: ComponentFixture<HistorialViajesPage>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const mockViaje: Viaje = {
    id: 1,
    origen: 'Origen Test',
    destino: 'Destino Test',
    fecha: '2024-03-15',
    hora: '10:00',
    estado: 'completado',
    asientosDisponibles: 3,
    precio: 1500,
    conductorNombre: 'Test Driver',
    vehiculo: {
      modeloVehiculo: 'Test Model',
      patente: 'ABC123'
    },
    pasajeros: []
  };

  beforeEach(async () => {
    const viajeSpy = jasmine.createSpyObj('ViajeService', ['getHistorialViajes']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsername']);

    await TestBed.configureTestingModule({
      declarations: [ HistorialViajesPage ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: ViajeService, useValue: viajeSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialViajesPage);
    component = fixture.componentInstance;
    viajeServiceSpy = TestBed.inject(ViajeService) as jasmine.SpyObj<ViajeService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load historial on init', () => {
    const mockViajes: Viaje[] = [{
      id: 1,
      origen: 'Origen Test',
      destino: 'Destino Test',
      fecha: '2024-03-15',
      hora: '10:00',
      estado: 'completado',
      asientosDisponibles: 3,
      precio: 1500,
      conductorNombre: 'Test Driver',
      vehiculo: {
        modeloVehiculo: 'Test Model',
        patente: 'ABC123'
      },
      pasajeros: []
    }];

    authServiceSpy.getUsername.and.returnValue('test@duocuc.cl');
    viajeServiceSpy.getHistorialViajes.and.returnValue(of(mockViajes));

    component.ngOnInit();

    expect(component.historial).toEqual(mockViajes);
  });

  it('should handle error when loading historial', () => {
    authServiceSpy.getUsername.and.returnValue('test@duocuc.cl');
    viajeServiceSpy.getHistorialViajes.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.historial).toEqual([]);
  });

  it('should refresh data on doRefresh', () => {
    const event = { target: { complete: jasmine.createSpy('complete') } };
    authServiceSpy.getUsername.and.returnValue('test@duocuc.cl');
    viajeServiceSpy.getHistorialViajes.and.returnValue(of([mockViaje]));

    component.doRefresh(event);

    expect(viajeServiceSpy.getHistorialViajes).toHaveBeenCalled();
    expect(event.target.complete).toHaveBeenCalled();
  });

  it('should filter viajes correctly', () => {
    component.historial = [mockViaje];
    component.filtroEstado = 'completado';

    component.filtrarViajes();

    expect(component.historialViajesFiltrados.length).toBe(1);
  });

  it('should return correct color for estado', () => {
    expect(component.getEstadoColor('disponible')).toBe('primary');
    expect(component.getEstadoColor('reservado')).toBe('warning');
    expect(component.getEstadoColor('completado')).toBe('success');
    expect(component.getEstadoColor('cancelado')).toBe('danger');
  });
});