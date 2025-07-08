import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Admin } from '../../services/admin.service';
import { ClientService, Client } from '../../services/client.service';
import { TransactionsService, Transaction } from '../../services/transactions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  menuOpen = false;
  activeSection: string = 'dashboard';
  filterClientName: string = '';

  // Admin data
  currentPage = 1;
  totalPages = 1;
  admins: Admin[] = [];

  // Client data
  clients: Client[] = [];
  currentClientPage = 1;
  totalClientPages = 1;

  //transactions data
  transactions: Transaction[] = [];
  currentTransactionPage = 1;
  totalTransactionPages = 1;

  //transactions history data
  transactionsHistory: Transaction[] = [];
  currentHistoryPage = 1;
  totalHistoryPages = 1;


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
    private clientService: ClientService,
    private transactionsService: TransactionsService 
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
  } else if (section === 'transactions') {
    this.loadTransactions();
  } else if (section === 'transactions-history') {
    this.loadTransactionHistory();
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

  loadTransactions(page: number = 1) {
  this.transactionsService.getTransactions(page).subscribe({
    next: (res) => {
      this.transactions = res.transactions;
      this.currentTransactionPage = res.page;
      this.totalTransactionPages = res.totalPages;
    },
    error: (err) => console.error('Failed to load transactions', err)
  });
}

nextTransactionPage() {
  if (this.currentTransactionPage < this.totalTransactionPages) {
    this.loadTransactions(this.currentTransactionPage + 1);
  }
}

prevTransactionPage() {
  if (this.currentTransactionPage > 1) {
    this.loadTransactions(this.currentTransactionPage - 1);
  }
}

loadTransactionHistory(page: number = 1) {
  this.transactionsService.getTransactionHistory(page, 10, this.filterClientName).subscribe({
    next: (res) => {
      this.transactionsHistory = res.history;
      this.currentHistoryPage = res.page;
      this.totalHistoryPages = res.totalPages;
    },
    error: (err) => console.error('Failed to load transaction history', err)
  });
}

nextHistoryPage() {
  if (this.currentHistoryPage < this.totalHistoryPages) {
    this.loadTransactionHistory(this.currentHistoryPage + 1);
  }
}

prevHistoryPage() {
  if (this.currentHistoryPage > 1) {
    this.loadTransactionHistory(this.currentHistoryPage - 1);
  }
}


}
