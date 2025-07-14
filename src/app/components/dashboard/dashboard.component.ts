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
  transactionChartOptions: any; // Define type as any or EChartsOption for flexibility
  userChartOptions: any; // Define type as any or EChartsOption for flexibility
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
  this.newTransaction = { clientId: 0, trackingMessage: '', trackingStatusId: 1, description: '' };
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
      alert('Name and email are required.');
      return;
    }

    this.clientService.updateClient(clientId, { clientName, email, isActive }).subscribe({
      next: () => {
        alert('Client updated successfully!');
        this.closeUpdateClientModal();
        this.loadClients(this.currentClientPage);
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert(err.error?.error || 'Update failed');
      }
    });
  }



  onDeleteClient(clientId: number, event: MouseEvent): void {
  event.stopPropagation(); 
  if (confirm('Are you sure you want to delete this client?')) {
    this.clientService.deleteClient(clientId).subscribe(() => {
      this.showUpdateClientModal = false; 
      this.loadClients(); 
    });
  }
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

onDeleteAdmin(adminId: number, event: MouseEvent) {
  event.stopPropagation();
  if (confirm('Are you sure you want to delete this admin?')) {
    this.adminService.deleteAdmin(adminId).subscribe({
      next: () => {
        this.loadAdmins(this.currentPage);
        this.closeUpdateAdminModal();
      },
      error: err => console.error('Delete failed', err)
    });
  }
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

updateTransaction() {
  const trackingId = this.selectedTransaction.trackingId;

  const updatedData = {
    clientId: this.selectedTransaction.clientId,
    trackingMessage: this.selectedTransaction.trackingMessage,
    trackingStatusId: this.selectedTransaction.trackingStatusId,
    description: this.selectedTransaction.description,
  };

  this.transactionsService.updateTransaction(trackingId, updatedData).subscribe(() => {
    this.loadTransactions(this.currentTransactionPage);
    this.closeUpdateTransactionModal();
  });
}

onDeleteTransaction(trackingId: string, event: MouseEvent): void {
  event.stopPropagation(); // Prevent row click or double-click event

  if (confirm("Are you sure you want to delete this transaction?")) {
    this.transactionsService.deleteTransaction(trackingId).subscribe(() => {
      this.loadTransactions(this.currentTransactionPage); // Refresh the transaction list
      this.closeUpdateTransactionModal(); // Optionally close modal if open
    });
  }
}

onDeleteTransactionHistory(trackingId: string): void {
  if (confirm('Are you sure you want to delete this transaction history?')) {
    this.transactionsService.deleteTransactionHistory(trackingId).subscribe({
      next: () => {
        alert('Transaction deleted successfully.');
        this.loadTransactionHistory(this.currentHistoryPage); // Reload the history list
      },
      error: (err) => {
        console.error('Error deleting transaction:', err);
        alert('Failed to delete transaction.');
      }
    });
  }
}




}


