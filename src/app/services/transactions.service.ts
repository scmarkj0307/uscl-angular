import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  historyId?: number;
  trackingId: number;
  clientId: number;
  clientName: string;
  trackingMessage: string;
  trackingStatusId: number;
  created_at: string;
  changed_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions/${id}`);
  }

  getTransactions(page: number = 1, limit: number = 10): Observable<{
    transactions: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return this.http.get<{
      transactions: Transaction[];
      total: number;
      page: number;
      totalPages: number;
    }>(`${this.baseUrl}/transactions?page=${page}&limit=${limit}`);
  }

  getTransactionHistory(
    page: number = 1,
    limit: number = 10,
    clientName: string = ''
  ): Observable<{
    history: Transaction[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    let url = `${this.baseUrl}/transaction-history?page=${page}&limit=${limit}`;
    if (clientName) {
      url += `&clientName=${encodeURIComponent(clientName)}`;
    }
    return this.http.get<{
      history: Transaction[];
      total: number;
      page: number;
      totalPages: number;
    }>(url);
  }

}
