import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, takeUntil, take, debounceTime } from 'rxjs';
import { Movie } from 'src/app/services/movie.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { MovieState, MovieStore } from 'src/app/stores/movie.store';

const DEBOUNCE_TIME = 1_000;

interface MoviesFormValue {
  query: string;
  sortBy: keyof Movie | null;
}

@Component({
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit, OnDestroy {
  private _destroy$: Subject<void> = new Subject();

  public form = new FormGroup({
    query: new FormControl<string>('', { nonNullable: true }),
    sortBy: new FormControl<keyof Movie | null>(null),
  });

  public sortByOptions: (keyof Movie)[] = [
    'Title',
    'IMDB Rating',
    'IMDB Votes',
    'Rotten Tomatoes Rating',
  ];

  public columns: (keyof Movie)[] = [
    'Title',
    'Director',
    'Release Date',
    'IMDB Rating',
    'IMDB Votes',
    'Rotten Tomatoes Rating',
  ];

  public movies$: Observable<MovieState['movieList']> =
    this.movieStore.selectMovies();
  public loadingMovies$: Observable<MovieState['loadingMovies']> =
    this.movieStore.loadingMovies$;
  public error$: Observable<MovieState['error']> = this.movieStore.error$;

  constructor(
    private authStore: AuthStore,
    private movieStore: MovieStore,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this._destroy$), debounceTime(DEBOUNCE_TIME))
      .subscribe(({ query, sortBy }: Partial<MoviesFormValue>) => {
        this.movieStore.patchState({ query, sortBy });
        this.movieStore.loadMovies();
      });

    this.movieStore.state$.pipe(take(1)).subscribe((state) => {
      this.form.setValue(
        { query: state.query, sortBy: state.sortBy },
        { emitEvent: false }
      );
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public resetQuery(): void {
    this.form.get('query')?.setValue('');
  }

  public logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
