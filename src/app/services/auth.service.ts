import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDemo: boolean;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface DecodedToken {
  admin_id: number;
  username: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDemo: boolean;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://uscl-node.onrender.com/api/auth';

  constructor(private http: HttpClient) {}

  register(data: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: LoginPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  storeToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decode token and return the user info
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (err) {
      console.error('Token decoding failed:', err);
      return null;
    }
  }

  getUsername(): string | null {
    return this.getDecodedToken()?.username ?? null;
  }

  isSuperAdmin(): boolean {
    return !!this.getDecodedToken()?.isSuperAdmin;
  }

  isDemo(): boolean {
    return !!this.getDecodedToken()?.isDemo;
  }

  isAdmin(): boolean {
    return !!this.getDecodedToken()?.isAdmin;
  }

  isSuperAdminOrDemo(): boolean {
    const decoded = this.getDecodedToken();
    return !!(decoded?.isSuperAdmin || decoded?.isDemo);
  }
}
