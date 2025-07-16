import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.authService.storeToken(res.token);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'snackbar-success'
          });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMsg = err.error.message || 'Login failed';
          this.snackBar.open(this.errorMsg, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: 'snackbar-error'
          });
        }
      });
    } else {
      this.snackBar.open('Username and password are required.', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: 'snackbar-error'
      });
    }
  }


   navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  navigateToTransactions() {
    this.router.navigateByUrl('/transactions');
  }
}
