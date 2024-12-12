import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ViajeService } from './viaje.service';
import { Viaje } from '../interfaces/viaje.interface';
import { environment } from 'src/environments/environment';

describe('ViajeService', () => {
  let service: ViajeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ViajeService]
    });
    service = TestBed.inject(ViajeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get viajes', async () => {
    const mockViajes: Viaje[] = [{
      id: 1,
      origen: 'Test',
      destino: 'Test',
      fecha: '2024-03-15',
      hora: '10:00', 
      precio: 1000,
      conductorNombre: 'Test',
      estado: 'disponible',
      asientosDisponibles: 4,
      vehiculo: {
        modeloVehiculo: 'Test',
        patente: 'AA1234'
      },
      pasajeros: []
    }];
  
    const req = httpMock.expectOne(`${environment.apiUrl}/viajes`);
    req.flush(mockViajes);
  
    const result = await service.getViajes();
    expect(result).toEqual(mockViajes);
  });
});