import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthStore } from '../stores/auth.store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authStore: AuthStore) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url === this.authStore.loginUrl) {
      return next.handle(req);
    }

    const token = this.authStore.getToken();
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(authReq);
  }
}
