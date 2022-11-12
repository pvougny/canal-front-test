import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, skipWhile, Subject, take, takeUntil } from 'rxjs';
import { AuthStore, AuthState } from 'src/app/stores/auth.store';
import { MovieStore } from 'src/app/stores/movie.store';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public form = new FormGroup({
    username: new FormControl<string>('Canal-plus', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl<string>('Super-secret', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  public loading$: Observable<AuthState['loading']> = this.authStore.loading$;
  public error$: Observable<AuthState['error']> = this.authStore.error$;

  private _destroy$: Subject<void> = new Subject();

  constructor(
    private authStore: AuthStore,
    private movieStore: MovieStore,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.movieStore.resetState();

    this.authStore.state$
      .pipe(
        takeUntil(this._destroy$),
        map((state) => state.token),
        skipWhile((token) => !token),
        take(1)
      )
      .subscribe(() => {
        this.router.navigate(['/movies']);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public submit(): void {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.authStore.login({ username: username!, password: password! });
    }
  }
}
