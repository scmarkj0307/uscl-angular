import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService, Admin } from '../../services/admin.service';
import { ClientService, Client } from '../../services/client.service';
import { TransactionsService, Transaction } from '../../services/transactions.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  statusOptions = [
  { id: 1, name: 'Pending' },
  { id: 2, name: 'Ongoing' },
  { id: 3, name: 'Finished' }
];
  showConfirmModal: boolean = false;
  confirmMessage: string = '';
  confirmCallback: (() => void) | null = null;
  transactionChartOptions: any; // Define type as any or EChartsOption for flexibility
  userChartOptions: any; // Define type as any or EChartsOption for flexibility
  menuOpen = false;
  activeSection: string = 'dashboard';
  filterClientName: string = '';
  showRegisterModal = false;
  newAdmin = {
  username: '',
  email: '',
  password: ''
};

newAdminRole: 'isAdmin' | 'isSuperAdmin' | 'isDemo' = 'isAdmin';

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
  showUpdateClientModal = false;
  selectedClient: any = null;
  showUpdateAdminModal = false;
  selectedAdmin: any = null;
  selectedTransaction: any = null;
  showUpdateTransactionModal = false;
  showTransactionModal = false;
  newTransaction = {
    clientId: 0,
    trackingMessage: '',
    trackingStatusId: 1,
    description: ''
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

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminService: AdminService,
    private clientService: ClientService,
    private transactionsService: TransactionsService,
    private snackBar: MatSnackBar
  ) {}

 ngOnInit() {
    this.transactionChartOptions = {
      tooltip: {
        trigger: 'axis' // Example: 'axis' trigger for bar chart
      },
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

    this.userChartOptions = {
      tooltip: {
        trigger: 'item' // Example: 'item' trigger for pie chart
      },
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

    if (this.activeSection === 'dashboard') {
      this.loadClients();
      this.loadTransactions();
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
  const { username, email, password } = this.newAdmin;
  const role = this.newAdminRole;

  if (!username || !email || !password || !role) {
    this.snackBar.open('All fields including role are required.', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    return;
  }

  const registerPayload = {
    username,
    email,
    password,
    isAdmin: role === 'isAdmin',
    isSuperAdmin: role === 'isSuperAdmin',
    isDemo: role === 'isDemo'
  };

  this.authService.register(registerPayload).subscribe({
    next: (res) => {
      this.loadAdmins();
      this.closeRegisterModal();
      this.snackBar.open(res.message || 'Admin registered successfully', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    },
    error: (err) => {
      const message = err.status === 409
        ? 'Username already exists.'
        : 'Failed to register admin.';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
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
    this.snackBar.open('Client name and email are required.', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    return;
  }

  const clientPayload = { clientName, email, isActive };

  this.clientService.addClient(clientPayload).subscribe({
    next: () => {
      this.snackBar.open('Client added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.closeClientModal();
      this.loadClients();
    },
    error: (err) => {
      const msg = err.error?.error || 'Failed to add client';
      this.snackBar.open(msg, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}



openTransactionModal() {
  this.showTransactionModal = true;
}

closeTransactionModal() {
  this.showTransactionModal = false;
  this.newTransaction = { clientId: 0, trackingMessage: '', trackingStatusId: 1, description: '' };
}

addTransaction() {
  if (!this.newTransaction.clientId || !this.newTransaction.trackingMessage) {
    this.snackBar.open('Client and Message are required.', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    return;
  }

  this.transactionsService.addTransaction(this.newTransaction).subscribe({
    next: () => {
      this.snackBar.open('Transaction added successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.closeTransactionModal();
      this.loadTransactions();
    },
    error: (err) => {
      const msg = err.error?.error || 'Failed to add transaction';
      this.snackBar.open(msg, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}


  onClientRowDoubleClick(client: Client) {
    this.selectedClient = {
      clientId: client.clientId,
      clientName: client.clientName,
      email: client.email,
      isActive: client.status === 'Active' // Convert string to boolean
    };
    this.showUpdateClientModal = true;
  }

  closeUpdateClientModal() {
    this.showUpdateClientModal = false;
    this.selectedClient = null;
  }


updateClient() {
  const { clientId, clientName, email, isActive } = this.selectedClient;

  if (!clientName || !email) {
    this.snackBar.open('Name and email are required.', 'Close', {
      duration: 3000,
      verticalPosition: 'top'
    });
    return;
  }

  this.clientService.updateClient(clientId, { clientName, email, isActive }).subscribe({
    next: () => {
      this.snackBar.open('Client updated successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.closeUpdateClientModal();
      this.loadClients(this.currentClientPage);
    },
    error: (err) => {
      const msg = err.error?.error || 'Failed to update client';
      this.snackBar.open(msg, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}




onDeleteClient(clientId: number, event: MouseEvent): void {
  event.stopPropagation();
  this.openConfirmModal('Are you sure you want to delete this client?', () => {
    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.snackBar.open('Client deleted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.showUpdateClientModal = false;
        this.loadClients();
      },
      error: (err) => {
        const msg = err.error?.error || 'Failed to delete client';
        this.snackBar.open(msg, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  });
}




onAdminRowDoubleClick(admin: any) {
  this.selectedAdmin = { ...admin };
  this.showUpdateAdminModal = true;
}

closeUpdateAdminModal() {
  this.selectedAdmin = null;
  this.showUpdateAdminModal = false;
}

updateAdmin() {
  const { admin_id, username, email } = this.selectedAdmin;

  if (!username || !email) {
    this.snackBar.open('Username and email are required.', 'Close', {
      duration: 3000,
      // horizontalPosition: 'end',
      verticalPosition: 'top',
      // panelClass: ['custom-snackbar-warning']
    });
    return;
  }

  this.adminService.updateAdmin(admin_id, { username, email }).subscribe({
    next: (res) => {
      this.loadAdmins();
      this.closeUpdateAdminModal();
      this.snackBar.open(res.message || 'Admin updated successfully', 'Close', {
        duration: 3000,
        // horizontalPosition: 'end',
        verticalPosition: 'top',
        // panelClass: ['custom-snackbar-successful']
      });
    },
    error: (err) => {
      const message = err.status === 409
        ? 'Username already exists.'
        : 'Failed to update admin.';
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        // horizontalPosition: 'end',
        verticalPosition: 'top',
        // panelClass: ['custom-snackbar-failed']
      });
    }
  });
}

onDeleteAdmin(adminId: number, event: MouseEvent): void {
  event.stopPropagation();
  this.openConfirmModal('Are you sure you want to delete this admin?', () => {
    this.adminService.deleteAdmin(adminId).subscribe({
      next: () => {
        this.snackBar.open('Admin deleted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.loadAdmins(this.currentPage);
        this.closeUpdateAdminModal();
      },
      error: (err) => {
        const msg = err.error?.error || 'Failed to delete admin';
        this.snackBar.open(msg, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  });
}




copyTrackingId(trackingId: string): void {
  navigator.clipboard.writeText(trackingId).then(() => {
    this.snackBar.open('Tracking ID copied!', 'Close', {
      duration: 2000,
      verticalPosition: 'top'
    });
  }).catch(err => {
    console.error('Failed to copy tracking ID: ', err);
    this.snackBar.open('Failed to copy!', 'Close', {
      duration: 2000,
      verticalPosition: 'top'
    });
  });
}


onTransactionRowDoubleClick(transaction: any) {
  const status = this.statusOptions.find(s => s.name === transaction.statusName);

  this.selectedTransaction = {
    trackingId: transaction.trackingId,
    clientId: transaction.clientId,
    trackingMessage: transaction.trackingMessage,
    trackingStatusId: status ? status.id : 1,
    description: transaction.description
  };

  this.showUpdateTransactionModal = true;
}


closeUpdateTransactionModal() {
  this.showUpdateTransactionModal = false;
}

updateTransaction(): void {
  const trackingId = this.selectedTransaction.trackingId;

  const updatedData = {
    clientId: this.selectedTransaction.clientId,
    trackingMessage: this.selectedTransaction.trackingMessage,
    trackingStatusId: this.selectedTransaction.trackingStatusId,
    description: this.selectedTransaction.description,
  };

  this.transactionsService.updateTransaction(trackingId, updatedData).subscribe({
    next: () => {
      this.snackBar.open('Transaction updated successfully!', 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
      this.loadTransactions(this.currentTransactionPage);
      this.closeUpdateTransactionModal();
    },
    error: (err) => {
      const msg = err.error?.error || 'Failed to update transaction';
      this.snackBar.open(msg, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }
  });
}


onDeleteTransaction(trackingId: string, event: MouseEvent): void {
  event.stopPropagation();
  this.openConfirmModal('Are you sure you want to delete this transaction?', () => {
    this.transactionsService.deleteTransaction(trackingId).subscribe({
      next: () => {
        this.snackBar.open('Transaction deleted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.loadTransactions(this.currentTransactionPage);
        this.closeUpdateTransactionModal();
      },
      error: (err) => {
        const msg = err.error?.error || 'Failed to delete transaction';
        this.snackBar.open(msg, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  });
}

onDeleteTransactionHistory(trackingId: string): void {
  this.openConfirmModal('Are you sure you want to delete this transaction history?', () => {
    this.transactionsService.deleteTransactionHistory(trackingId).subscribe({
      next: () => {
        this.snackBar.open('Transaction history deleted successfully!', 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
        this.loadTransactionHistory(this.currentHistoryPage);
      },
      error: (err) => {
        const msg = err.error?.error || 'Failed to delete transaction history';
        this.snackBar.open(msg, 'Close', {
          duration: 3000,
          verticalPosition: 'top'
        });
      }
    });
  });
}



openConfirmModal(message: string, callback: () => void): void {
  this.confirmMessage = message;
  this.confirmCallback = callback;
  this.showConfirmModal = true;
}

confirmAction(): void {
  if (this.confirmCallback) {
    this.confirmCallback();
  }
  this.closeConfirmModal();
}

closeConfirmModal(): void {
  this.showConfirmModal = false;
  this.confirmMessage = '';
  this.confirmCallback = null;
}





}


