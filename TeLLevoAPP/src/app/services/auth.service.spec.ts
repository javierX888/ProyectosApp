import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from '../services/api.service';
import { Storage } from '@ionic/storage-angular';
import { of, throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let storageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['login']);
    const storageSpyObj = jasmine.createSpyObj('Storage', ['get', 'set', 'clear']);
    
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Storage, useValue: storageSpyObj }
      ]
    });
    
    service = TestBed.inject(AuthService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
  });

  it('should login successfully', async () => {
    const mockResponse = {
      token: 'fake-token',
      user: {
        id: '1',
        email: 'test@duocuc.cl',
        tipo: 'pasajero' as const,
        nombre: 'Test User' // Agregando la propiedad faltante
      }
    };
    
    apiServiceSpy.login.and.returnValue(of(mockResponse));
    storageSpy.set.and.returnValue(Promise.resolve());
    
    const result = await service.login('test@duocuc.cl', '123456');
    expect(result).toBeTruthy();
    expect(apiServiceSpy.login).toHaveBeenCalledWith('test@duocuc.cl', '123456');
  });

  it('should handle login error', async () => {
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('Error')));
    
    try {
      await service.login('test@duocuc.cl', '123456');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  it('should logout successfully', async () => {
    storageSpy.clear.and.returnValue(Promise.resolve());
    
    await service.logout();
    expect(storageSpy.clear).toHaveBeenCalled();
  });
});