import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Admin } from '../../services/admin.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  menuOpen = false;
  activeSection: string = 'dashboard';
  currentPage = 1;
  totalPages = 1;
  admins: Admin[] = [];

  constructor(private authService: AuthService, 
              private router: Router,
              private adminService: AdminService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  loadAdmins(page: number = 1) {
    this.adminService.getAdmins(page).subscribe({
      next: (res) => {
        this.admins = res.admins;
        this.currentPage = res.page;
        this.totalPages = res.totalPages;
      },
      error: (err) => console.error('Failed to load admins', err)
    });
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'admins') {
      this.loadAdmins();
    }
  }

  nextPage() {
  if (this.currentPage < this.totalPages) {
    this.loadAdmins(this.currentPage + 1);
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.loadAdmins(this.currentPage - 1);
  }
}


  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
