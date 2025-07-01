import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  showCircle = true;
  menuOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkScreenSize();
  }

  // Automatically updates `showCircle` based on screen size
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  // Show circle only if width >= 800px
  checkScreenSize() {
    this.showCircle = window.innerWidth >= 800;
  }

  // Toggle burger menu visibility
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  // Optional navigation method to go to /transactions
  navigateToTransactions() {
    this.router.navigateByUrl('/transactions');
  }
}
