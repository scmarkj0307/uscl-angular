import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionsService } from '../../services/transactions.service';

@Component({
  selector: 'app-track-transactions',
  templateUrl: './track-transactions.component.html',
  styleUrls: ['./track-transactions.component.css']
})
export class TrackTransactionsComponent {
  trackingId: any;
  transaction: any;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private router: Router, private TransactionsService: TransactionsService) {}

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  track() {
     this.TransactionsService.getTransactionById(this.trackingId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
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
