import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface UserData {
  id?: number;
  email: string;
  tipo: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://tellevoapp-api-production.up.railway.app/api';
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser: Observable<UserData | null>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<UserData | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): UserData | null {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error al obtener usuario del storage:', error);
      return null;
    }
  }

  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  getUsername(): string {
    return this.currentUserValue?.email || '';
  }

  getProfile(): Observable<any> {
    const userData = this.currentUserValue;
    if (!userData) {
      return throwError(() => new Error('No hay usuario autenticado'));
    }
  
    // Cambiar la ruta a /api/users/profile
    return this.http.get(`${this.apiUrl}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en getProfile:', error);
        return throwError(() => error);
      })
    );
  }

  addVehiculo(vehiculo: any): Observable<any> {
    const userData = this.currentUserValue;
    return this.http.post(`${this.apiUrl}/vehicles`, vehiculo, {
      headers: {
        'Authorization': `Bearer ${userData?.token}`
      }
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  getVehiculos(): Observable<any[]> {
    const userData = this.currentUserValue;
    if (!userData) {
      return throwError(() => new Error('No hay usuario autenticado'));
    }
  
    // Cambiar la ruta a /api/vehicles
    return this.http.get<any[]>(`${this.apiUrl}/vehicles`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`
      }
    });
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { email }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  login(email: string, password: string): Observable<any> {
    const credentials = {
      email: email,
      contraseña: password
    }; 

    return this.http.post<any>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          const userData: UserData = {
            id: response.user?.id || response.id,
            email: response.user?.email || response.email,
            tipo: response.user?.tipo || response.tipo,
            token: response.token
          };
          localStorage.setItem('currentUser', JSON.stringify(userData));
          this.currentUserSubject.next(userData);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }

  getUserType(): string | null {
    return this.currentUserValue?.tipo || null;
  }
}