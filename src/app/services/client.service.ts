// src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  clientid: number;
  clientName: string;
  email: string;
  created_at: string;
  status: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'https://uscl-node.onrender.com/api/clients';

  constructor(private http: HttpClient) {}

  getClients(page: number = 1, limit: number = 10): Observable<{
    clients: Client[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  addClient(clientData: { clientName: string; email: string; isActive: boolean }): Observable<any> {
    return this.http.post(this.apiUrl, clientData);
  }

  updateClient(clientId: number, clientData: { clientName: string; email: string; isActive: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${clientId}`, clientData);
  }


  deleteClient(clientid: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${clientid}`);
}



}
