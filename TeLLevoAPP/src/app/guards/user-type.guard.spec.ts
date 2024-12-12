import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserTypeGuard } from './user-type.guard';
import { AuthService } from '../services/auth.service';
import { User } from '../interfaces/user.interface';

describe('UserTypeGuard', () => {
  let guard: UserTypeGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const createMockRoute = (role: string): ActivatedRouteSnapshot => {
    return {
      data: { ['requiredRole']: role },
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      outlet: '',
      component: null,
      routeConfig: null,
      root: null,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: new Map(),
      queryParamMap: new Map()
    } as unknown as ActivatedRouteSnapshot;
  };

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        UserTypeGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    guard = TestBed.inject(UserTypeGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access for correct user type', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@duocuc.cl',
      tipo: 'conductor',
      nombre: 'Test User'
    };

    const mockRoute = createMockRoute('conductor');
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    const result = await guard.canActivate(mockRoute);
    expect(result).toBe(true);
  });

  it('should deny access for incorrect user type', async () => {
    const mockUser: User = {
      id: '1',
      email: 'test@duocuc.cl',
      tipo: 'pasajero',
      nombre: 'Test User'
    };

    const mockRoute = createMockRoute('conductor');
    authServiceSpy.getCurrentUser.and.returnValue(mockUser);

    const result = await guard.canActivate(mockRoute);
    expect(result).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});