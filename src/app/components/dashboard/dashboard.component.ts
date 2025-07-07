import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Admin } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menuOpen = false;
  activeSection: string = 'dashboard';
  currentPage = 1;
  totalPages = 1;
  admins: Admin[] = [];

  // Chart options
  transactionChartOptions = {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Finished', 'Ongoing', 'Pending'],  // Reordered for clarity
      axisLabel: { fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 12 }
    },
    series: [
      {
        data: [12, 6, 4], // Update these values as needed
        type: 'bar',
        itemStyle: {
          color: (params: any) => {
            const colors = ['#4CAF50', '#2196F3', '#FF9800']; // Finished, Ongoing, Pending
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
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'bottom',
    textStyle: {
      fontSize: 12
    }
  },
  series: [
    {
      name: 'Clients',
      type: 'pie',
      radius: '60%',
      data: [
        { value: 5, name: 'Active' },     // Replace with dynamic value if needed
        { value: 3, name: 'Inactive' }    // Replace with dynamic value if needed
      ],
      label: {
        fontSize: 12,
        formatter: '{b}: {d}%'
      },
      itemStyle: {
        color: (params: any) => {
          const colors: { [key: string]: string } = {
            'Active': '#2196F3',   // Blue
            'Inactive': '#F44336'  // Red
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
    private adminService: AdminService
  ) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  setSection(section: string) {
    this.activeSection = section;
    if (section === 'admins') {
      this.loadAdmins();
    }
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
