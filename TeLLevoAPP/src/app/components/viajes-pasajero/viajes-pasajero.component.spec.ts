import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { ViajesPasajeroComponent } from './viajes-pasajero.component';
import { ViajeService } from '../../services/viaje.service';
import { AuthService } from '../../services/auth.service';
import { Viaje } from '../../interfaces/viaje.interface';
import { of, throwError } from 'rxjs';

describe('ViajesPasajeroComponent', () => {
  let component: ViajesPasajeroComponent;
  let fixture: ComponentFixture<ViajesPasajeroComponent>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  const mockViaje: Viaje = {
    id: 1,
    origen: 'Test Origin',
    destino: 'Test Destination',
    fecha: '2024-03-15',
    hora: '10:00',
    asientosDisponibles: 4,
    precio: 1000,
    conductorNombre: 'Test Driver',
    estado: 'disponible',
    vehiculo: {
      modeloVehiculo: 'Test Car',
      patente: 'TEST123'
    },
    pasajeros: []
  };

  beforeEach(async () => {
    const viajeSpy = jasmine.createSpyObj('ViajeService', ['reservarViaje', 'cancelarViaje']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUsername']);
    const alertSpy = jasmine.createSpyObj('AlertController', ['create']);
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ ViajesPasajeroComponent ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: ViajeService, useValue: viajeSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: AlertController, useValue: alertSpy },
        { provide: ToastController, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViajesPasajeroComponent);
    component = fixture.componentInstance;
    component.viaje = mockViaje;
    viajeServiceSpy = TestBed.inject(ViajeService) as jasmine.SpyObj<ViajeService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    alertControllerSpy = TestBed.inject(AlertController) as jasmine.SpyObj<AlertController>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isReserved correctly', () => {
    component.ngOnInit();
    expect(component.isReserved).toBeFalse();
  });

  it('should reserve a viaje successfully', async () => {
    const mockAlertElement = {
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ role: 'ok' })),
      dismiss: jasmine.createSpy('dismiss')
    } as unknown as HTMLIonAlertElement;

    const mockToastElement = {
      present: jasmine.createSpy('present')
    } as any;

    alertControllerSpy.create.and.returnValue(Promise.resolve(mockAlertElement));
    toastControllerSpy.create.and.returnValue(Promise.resolve(mockToastElement));
    authServiceSpy.getUsername.and.returnValue('testuser');
    viajeServiceSpy.reservarViaje.and.returnValue(of(mockViaje));

    await component.reservarViaje();
    expect(component.isReserved).toBeTrue();
  });

  it('should handle reserve error', async () => {
    const mockAlertElement = {
      present: jasmine.createSpy('present'),
      onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ role: 'ok' })),
      dismiss: jasmine.createSpy('dismiss')
    } as unknown as HTMLIonAlertElement;

    const mockToastElement = {
      present: jasmine.createSpy('present')
    } as any;

    alertControllerSpy.create.and.returnValue(Promise.resolve(mockAlertElement));
    toastControllerSpy.create.and.returnValue(Promise.resolve(mockToastElement));
    authServiceSpy.getUsername.and.returnValue('testuser');
    viajeServiceSpy.reservarViaje.and.returnValue(throwError(() => new Error('Test error')));

    await component.reservarViaje();
    expect(component.isReserved).toBeFalse();
  });
});