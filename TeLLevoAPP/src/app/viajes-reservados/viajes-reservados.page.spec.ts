import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ViajesReservadosPage } from './viajes-reservados.page';
import { ViajeService } from '../services/viaje.service';
import { AuthService } from '../services/auth.service';
import { Viaje } from '../interfaces/viaje.interface';
import { of } from 'rxjs';

describe('ViajesReservadosPage', () => {
  let component: ViajesReservadosPage;
  let fixture: ComponentFixture<ViajesReservadosPage>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockViaje: Viaje = {
    id: 1,
    origen: 'Origen Test',
    destino: 'Destino Test',
    fecha: '2024-03-15',
    hora: '10:00',
    asientosDisponibles: 3,
    precio: 1500,
    conductorNombre: 'Test Driver',
    estado: 'reservado',
    vehiculo: {
      modeloVehiculo: 'Test Model',
      patente: 'ABC123'
    },
    pasajeros: []
  };

  beforeEach(async () => {
    const viajeSpy = jasmine.createSpyObj('ViajeService', ['getViajesReservados']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsername']);

    await TestBed.configureTestingModule({
      declarations: [ViajesReservadosPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ViajeService, useValue: viajeSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViajesReservadosPage);
    component = fixture.componentInstance;
    viajeServiceSpy = TestBed.inject(ViajeService) as jasmine.SpyObj<ViajeService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load viajes reservados on init', () => {
    const mockViajes: Viaje[] = [mockViaje];
    authServiceSpy.getUsername.and.returnValue('test@mail.com');
    viajeServiceSpy.getViajesReservados.and.returnValue(of(mockViajes));
    
    component.ngOnInit();
    expect(viajeServiceSpy.getViajesReservados).toHaveBeenCalled();
  });
});