import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-track-transactions',
  templateUrl: './track-transactions.component.html',
  styleUrls: ['./track-transactions.component.css']
})
export class TrackTransactionsComponent {
  trackingId: string = '';
  transaction: any;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  track() {
    if (!this.trackingId.trim()) return;

    this.http.get(`http://localhost:3000/api/transactions/${this.trackingId}`).subscribe({
      next: (data) => {
        this.transaction = data;
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Tracking error:', err);
        this.showErrorModal = true;
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
