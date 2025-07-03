import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Admin {
  admin_id: number;
  username: string;
  email: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:3000/api/admins';

  constructor(private http: HttpClient) {}

getAdmins(page: number = 1, limit: number = 10): Observable<{
  admins: Admin[];
  total: number;
  page: number;
  totalPages: number;
}> {
  return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
}

}
