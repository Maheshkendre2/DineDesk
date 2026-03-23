import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { User, LoginRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  // Mock users database
  private mockUsers: User[] = [
    { id: '1', email: 'admin@dinedesk.com', password: 'admin123', role: 'admin', name: 'Admin User', token: '' },
    { id: '2', email: 'waiter@dinedesk.com', password: 'waiter123', role: 'waiter', name: 'Waiter User', token: '' },
    { id: '3', email: 'chef@dinedesk.com', password: 'chef123', role: 'chef', name: 'Chef User', token: '' },
    { id: '4', email: 'cashier@dinedesk.com', password: 'cashier123', role: 'cashier', name: 'Cashier User', token: '' }
  ];

  constructor() {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Find user in mock users database
    const user = this.mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (user) {
      const token = this.generateMockToken(user);
      const userWithoutPassword: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token
      };

      const response: AuthResponse = {
        token: token,
        user: userWithoutPassword
      };

      return of(response).pipe(
        delay(500), // Simulate network delay
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
    }

    // Return error if credentials invalid
    return throwError(() => new Error('Invalid email or password')).pipe(
      delay(500)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserValue;
  }

  getUserRole(): string | null {
    return this.currentUserValue?.role || null;
  }

  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user from storage', error);
      return null;
    }
  }

  /**
   * Generate a mock JWT token (for development without backend)
   */
  private generateMockToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('mock-dinedesk-signature-development');

    return `${header}.${payload}.${signature}`;
  }
}
