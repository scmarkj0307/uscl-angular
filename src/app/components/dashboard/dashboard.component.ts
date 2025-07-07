import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Admin } from '../../services/admin.service';
import { ClientService, Client } from '../../services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menuOpen = false;
  activeSection: string = 'dashboard';

  // Admin data
  currentPage = 1;
  totalPages = 1;
  admins: Admin[] = [];

  // Client data
  clients: Client[] = [];
  currentClientPage = 1;
  totalClientPages = 1;

  // Chart options
  transactionChartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Finished', 'Ongoing', 'Pending'],
      axisLabel: { fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 12 }
    },
    series: [
      {
        data: [12, 6, 4],
        type: 'bar',
        itemStyle: {
          color: (params: any) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800'];
            return colors[params.dataIndex];
          }
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 12
        }
      }
    ]
  };

  userChartOptions = {
    tooltip: { trigger: 'item' },
    legend: {
      top: 'bottom',
      textStyle: { fontSize: 12 }
    },
    series: [
      {
        name: 'Clients',
        type: 'pie',
        radius: '60%',
        data: [
          { value: 5, name: 'Active' },
          { value: 3, name: 'Inactive' }
        ],
        label: {
          fontSize: 12,
          formatter: '{b}: {d}%'
        },
        itemStyle: {
          color: (params: any) => {
            const colors: { [key: string]: string } = {
              'Active': '#2196F3',
              'Inactive': '#F44336'
            };
            return colors[params.name] || '#999';
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService,
    private clientService: ClientService
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'admins') {
      this.loadAdmins();
    } else if (section === 'clients') {
      this.loadClients();
    }
  }

  // Admin logic
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

  // Client logic
  loadClients(page: number = 1) {
    this.clientService.getClients(page).subscribe({
      next: (res) => {
        this.clients = res.clients;
        this.currentClientPage = res.page;
        this.totalClientPages = res.totalPages;
      },
      error: (err) => console.error('Failed to load clients', err)
    });
  }

  nextClientPage() {
    if (this.currentClientPage < this.totalClientPages) {
      this.loadClients(this.currentClientPage + 1);
    }
  }

  prevClientPage() {
    if (this.currentClientPage > 1) {
      this.loadClients(this.currentClientPage - 1);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
