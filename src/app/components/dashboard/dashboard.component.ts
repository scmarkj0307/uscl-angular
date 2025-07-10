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
  showRegisterModal = false;
  newAdmin = { username: '', email: '', password: '' };
  userChartData = [
  { value: 0, name: 'Active' },
  { value: 0, name: 'Inactive' }
  ];
  transactionChartData = [
    { value: 0, name: 'Finished' },
    { value: 0, name: 'Ongoing' },
    { value: 0, name: 'Pending' }
  ];
  showClientModal = false;
  newClient = { clientName: '', email: '', isActive: true };
  showTransactionModal = false;
  newTransaction = {
    clientId: 0,
    trackingMessage: '',
    trackingStatusId: 1
  };


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
        data: this.transactionChartData.map(d => d.value),
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
        data: this.userChartData,
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

  ngOnInit() {
    if (this.activeSection === 'dashboard') {
      this.loadClients();        // 👈 Load chart data on load
      this.loadTransactions();   // 👈 preload transaction data
    }
  }

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

      const activeCount = this.clients.filter(c => c.status === 'Active').length;
      const inactiveCount = this.clients.filter(c => c.status === 'Inactive').length;

      // Replace array reference so Angular detects changes
      this.userChartData = [
        { value: activeCount, name: 'Active' },
        { value: inactiveCount, name: 'Inactive' }
      ];

      // Optional: If you're binding `userChartOptions.series[0].data` dynamically,
      // you might need to update the `userChartOptions` to force update
      this.userChartOptions = {
        ...this.userChartOptions,
        series: [
          {
            ...this.userChartOptions.series[0],
            data: this.userChartData
          }
        ]
      };
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

      // Count status occurrences
      const finished = this.transactions.filter(t => t.statusName === 'Finished').length;
      const ongoing = this.transactions.filter(t => t.statusName === 'Ongoing').length;
      const pending = this.transactions.filter(t => t.statusName === 'Pending').length;

      // Update chart data
      this.transactionChartData = [
        { value: finished, name: 'Finished' },
        { value: ongoing, name: 'Ongoing' },
        { value: pending, name: 'Pending' }
      ];

      // Rebuild chart options with updated data
      this.transactionChartOptions = {
        ...this.transactionChartOptions,
        series: [
          {
            ...this.transactionChartOptions.series[0],
            data: this.transactionChartData.map(d => d.value)
          }
        ]
      };
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

openRegisterModal() {
  this.showRegisterModal = true;
}

closeRegisterModal() {
  this.showRegisterModal = false;
  this.newAdmin = { username: '', email: '', password: '' };
}

registerAdmin() {
  this.authService.register(this.newAdmin).subscribe({
    next: (res) => {
      alert('Admin registered successfully!');
      this.closeRegisterModal();
      this.loadAdmins(); // Reload the admins table
    },
    error: (err) => {
      console.error('Register error:', err);
      const msg = err.error?.message || 'Registration failed';
      alert(msg);
    }
  });
}

openClientModal() {
  this.showClientModal = true;
}

closeClientModal() {
  this.showClientModal = false;
  this.newClient = { clientName: '', email: '', isActive: true };
}

addClient() {
  const { clientName, email, isActive } = this.newClient;

  if (!clientName || !email) {
    alert('Name and Email are required.');
    return;
  }

  const clientPayload = {
    clientName,
    email,
    isActive
  };

  this.clientService.addClient(clientPayload).subscribe({
    next: () => {
      alert('Client added successfully!');
      this.closeClientModal();
      this.loadClients();
    },
    error: (err) => {
      console.error('Failed to add client:', err);
      const msg = err.error?.error || 'Adding client failed';
      alert(msg);
    }
  });
}


openTransactionModal() {
  this.showTransactionModal = true;
}

closeTransactionModal() {
  this.showTransactionModal = false;
  this.newTransaction = { clientId: 0, trackingMessage: '', trackingStatusId: 1 };
}

addTransaction() {
  if (!this.newTransaction.clientId || !this.newTransaction.trackingMessage) {
    alert('Client and Message are required.');
    return;
  }

  this.transactionsService.addTransaction(this.newTransaction).subscribe({
    next: () => {
      alert('Transaction added successfully!');
      this.closeTransactionModal();
      this.loadTransactions(); // reload transactions list
    },
    error: (err) => {
      console.error('Failed to add transaction:', err);
      const msg = err.error?.error || 'Adding transaction failed';
      alert(msg);
    }
  });
}





}


