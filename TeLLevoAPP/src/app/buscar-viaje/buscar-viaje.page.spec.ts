import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BuscarViajePage } from './buscar-viaje.page';
import { ViajeService } from '../services/viaje.service';
import { Viaje } from '../interfaces/viaje.interface';

describe('BuscarViajePage', () => {
  let component: BuscarViajePage;
  let fixture: ComponentFixture<BuscarViajePage>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;

  const mockViaje: Viaje = {
    id: 1,
    origen: 'Origen Test',
    destino: 'Destino Test',
    fecha: '2024-03-15',
    hora: '10:00',
    asientosDisponibles: 3,
    precio: 1500,
    conductorNombre: 'Test Driver',
    estado: 'disponible',
    vehiculo: {
      modeloVehiculo: 'Test Model',
      patente: 'ABC123'
    },
    pasajeros: []
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ViajeService', ['getViajes', 'getViajesDisponibles']);
    spy.getViajesDisponibles.and.returnValue(Promise.resolve([mockViaje]));
    
    await TestBed.configureTestingModule({
      declarations: [BuscarViajePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ViajeService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarViajePage);
    component = fixture.componentInstance;
    viajeServiceSpy = TestBed.inject(ViajeService) as jasmine.SpyObj<ViajeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load viajes on init', async () => {
    const mockViajes: Viaje[] = [mockViaje];
    await component.ngOnInit();
    expect(viajeServiceSpy.getViajesDisponibles).toHaveBeenCalled();
    expect(component.viajes).toEqual(mockViajes);
  });
});