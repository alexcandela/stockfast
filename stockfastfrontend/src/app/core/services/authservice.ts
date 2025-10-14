import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, Register, AuthResponse } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtPayloadInterface } from '../interfaces/auth';

import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class Authservice {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) {}

  register = (data: Register): Observable<AuthResponse> => {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  };

  login = (data: Login): Observable<AuthResponse> => {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  };

  // Guarda token en localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('token');
  }

  isTokenValid(token: string): boolean {
    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if (!decodedToken.exp) {
        return false;
      }
      const expiryTime = decodedToken.exp * 1000; //
      const currentTime = Date.now();
      return expiryTime > currentTime;
    } catch (error) {
      return false;
    }
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayloadInterface>(token);
      return decoded.username || null;
    } catch (error) {
      console.error('Token inválido', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
