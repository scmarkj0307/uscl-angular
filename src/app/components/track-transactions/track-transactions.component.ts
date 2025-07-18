import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-track-transactions',
  templateUrl: './track-transactions.component.html',
  styleUrls: ['./track-transactions.component.css']
})
export class TrackTransactionsComponent {
  trackingid: any;
  transaction: any;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  loading = false;

  constructor(private router: Router, private TransactionsService: TransactionsService) {}

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

   navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  track() {
    this.loading = true;
    this.showSuccessModal = false;
    this.showErrorModal = false;

    this.TransactionsService.getTransactionById(this.trackingid).subscribe({
      next: (data) => {
        this.transaction = data;
        this.showSuccessModal = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
        this.showErrorModal = true;
        this.loading = false;
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
