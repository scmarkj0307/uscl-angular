import { Injectable } from '@angular/core';
import {
  Router,
  UrlTree
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean | UrlTree {
    const isLoggedIn = this.authService.isLoggedIn(); // ✅ This should return true only if token exists

    if (isLoggedIn) {
      return true;
    } else {
      return this.router.parseUrl('/login'); // ⛔ redirect to login if not logged in
    }
  }
}
