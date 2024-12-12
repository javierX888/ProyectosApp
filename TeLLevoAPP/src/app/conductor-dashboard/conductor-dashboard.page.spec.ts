import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { ConductorDashboardPage } from './conductor-dashboard.page';
import { AuthService } from '../services/auth.service';
import { ViajeService } from '../services/viaje.service';
import { User } from '../interfaces/user.interface';

describe('ConductorDashboardPage', () => {
  let component: ConductorDashboardPage;
  let fixture: ComponentFixture<ConductorDashboardPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let viajeServiceSpy: jasmine.SpyObj<ViajeService>;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;

  beforeEach(async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@duocuc.cl',
      tipo: 'conductor',
      nombre: 'Test User'
    };

    // Definimos el espía con métodos tipados
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getCurrentUser', 'getUsername', 'logout']);

    // Configuramos el retorno del método getCurrentUser
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    // Configuramos los otros métodos
    authServiceSpy.getUsername.and.returnValue('test@duocuc.cl');
    authServiceSpy.logout.and.returnValue(Promise.resolve());

    // Creamos los otros espías
    viajeServiceSpy = jasmine.createSpyObj<ViajeService>('ViajeService', ['getEstadisticasConductor']);
    alertControllerSpy = jasmine.createSpyObj<AlertController>('AlertController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ ConductorDashboardPage ],
      imports: [ 
        IonicModule.forRoot(),
        RouterTestingModule 
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ViajeService, useValue: viajeServiceSpy },
        { provide: AlertController, useValue: alertControllerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConductorDashboardPage);
    component = fixture.componentInstance;
  });

  it('should load user data successfully', async () => {
    await component.cargarDatosUsuario();

    expect(component.nombreUsuario).toBe('Test User');
    expect(component.email).toBe('test@duocuc.cl');
  });
});