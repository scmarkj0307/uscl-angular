import { Component } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-get-user',
  templateUrl: './get-user.component.html',
  styleUrls: ['./get-user.component.css']
})
export class GetUserComponent {
  userId: number = 0;
  user: any;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;

  constructor(private userService: UserService) {}

  fetchUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (data) => {
        this.user = data;
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
