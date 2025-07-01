import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-track-transactions',
  templateUrl: './track-transactions.component.html',
  styleUrl: './track-transactions.component.css'
})
export class TrackTransactionsComponent {
  
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }
  
    images = [
    'assets/images/image1.png',
    'assets/images/image2.png',
    'assets/images/image3.png'
  ];
}

