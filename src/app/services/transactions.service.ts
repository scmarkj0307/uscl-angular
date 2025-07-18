import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  historyid?: number;
  trackingid: string; // changed from number to string
  clientid: number;
  clientName: string;
  trackingmessage: string;
  trackingstatusid: number;
  description?: string;
  created_at: string;
  changed_at?: string;
  statusname: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly baseUrl = 'https://uscl-node.onrender.com/api';

  constructor(private http: HttpClient) {}

  getTransactionById(id: string): Observable<Transaction> {
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

  addTransaction(transaction: {
    clientid: number;
    trackingmessage: string;
    trackingstatusid: number;
    description?: string;
  }): Observable<{ message: string; trackingid: string }> {
    return this.http.post<{ message: string; trackingid: string }>(
      `${this.baseUrl}/transactions`,
      transaction
    );
  }

  updateTransaction(trackingId: string, updatedData: {
    clientid: number;
    trackingmessage: string;
    trackingstatusid: number;
    description?: string;
  }): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.baseUrl}/transactions/${trackingId}`,
      updatedData
    );
  }

  deleteTransaction(trackingid: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/transactions/${trackingid}`
    );
  }

  deleteTransactionHistory(trackingid: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(
    `${this.baseUrl}/transaction-history/${trackingid}`
  );
}

}
