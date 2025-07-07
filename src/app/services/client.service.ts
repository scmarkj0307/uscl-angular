// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  clientId: number;
  clientName: string;
  email: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:3000/api/clients';

  constructor(private http: HttpClient) {}

  getClients(page: number = 1, limit: number = 10): Observable<{
    clients: Client[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
