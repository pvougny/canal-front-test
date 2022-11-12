import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, LoginResponse } from '../services/auth.service';

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

const TOKEN_KEY = 'token';

@Injectable()
export class AuthStore extends ComponentStore<AuthState> {
  public loginUrl = `${environment.api}/auth/login`;

  public loading$: Observable<AuthState['loading']> = this.select(
    (state) => state.loading
  );

  public error$: Observable<AuthState['error']> = this.select(
    (state) => state.error
  );

  constructor(private authService: AuthService) {
    super(initialState);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public login = this.effect(
    (action$: Observable<{ username: string; password: string }>) => {
      return action$.pipe(
        tap(() => {
          this.patchState({ loading: true, error: null });
        }),
        switchMap(({ username, password }) =>
          this.authService.login(username, password).pipe(
            tap((res: LoginResponse) => {
              const token = res.token;
              this.patchState({ loading: false, token });
              localStorage.setItem(TOKEN_KEY, token);
            }),
            catchError((res: HttpErrorResponse) => {
              this.patchState({ loading: false, error: res.error.err });

              return EMPTY;
            })
          )
        )
      );
    }
  );

  public logout(): void {
    this.resetState();
    localStorage.removeItem(TOKEN_KEY);
  }

  private resetState(): void {
    this.patchState(initialState);
  }
}
