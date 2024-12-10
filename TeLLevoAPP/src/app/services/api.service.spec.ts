import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully', () => {
    const mockResponse = {
      token: 'fake-jwt-token',
      user: {
        id: '123',
        email: 'test@duocuc.cl',
        tipo: 'pasajero',
        nombre: 'Test User'
      }
    };

    service.login('test@duocuc.cl', '123456').subscribe((response) => {
      expect(response.token).toBe('fake-jwt-token');
      expect(response.user.email).toBe('test@duocuc.cl');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/users/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
