import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../stores/auth.store';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(private authStore: AuthStore, private router: Router) {}

  public canActivate(): true | UrlTree {
    return (
      !this.authStore.isAuthenticated() || this.router.parseUrl('/movies')
    );
  }
}
