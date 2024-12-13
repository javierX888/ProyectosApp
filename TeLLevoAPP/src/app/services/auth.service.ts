import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(this.initializeUser());
    this.currentUser = this.currentUserSubject.asObservable();
    this.initializeStorage();
  }

  private initializeUser() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error inicializando usuario:', error);
      return null;
    }
  }

  private async initializeStorage() {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error inicializando storage:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Debug
          if (response && response.token) {
            this.handleAuthentication(response);
          }
        })
      );
  }

  private handleAuthentication(response: any) {
    const token = response.token;
    const decodedToken = this.decodeToken(token);
    
    if (!decodedToken) {
      throw new Error('Token inválido');
    }

    const user = {
      email: decodedToken.email,
      tipo: decodedToken.tipo,
      token: token
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getUserType(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.tipo : null;
  }

  getUsername(): string {
    const user = this.currentUserSubject.value;
    return user ? user.email : '';
  }

  addVehiculo(vehiculo: any): Observable<any> {
    const email = this.getUsername();
    return this.http.post(`${this.apiUrl}/usuarios/${email}/vehiculos`, vehiculo);
  }

  getVehiculos(): Observable<any[]> {
    const email = this.getUsername();
    return this.http.get<any[]>(`${this.apiUrl}/usuarios/${email}/vehiculos`);
  }

  getProfile(): Observable<any> {
    const email = this.getUsername();
    return this.http.get(`${this.apiUrl}/usuarios/${email}`);
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/reset-password`, { email });
  }
}