import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Movie, MovieService } from '../services/movie.service';

export interface MovieState {
  query: string;
  sortBy: keyof Movie | null;
  movieList: Movie[];
  movieEntities: Record<Movie['id'], Movie>;
  loadingMovies: 'not_started' | 'in_progress' | 'success' | 'failed';
  loadingMovie: 'not_started' | 'in_progress' | 'success' | 'failed';
  error: string | null;
}

const initialState: MovieState = {
  query: '',
  sortBy: 'Title',
  loadingMovies: 'not_started',
  loadingMovie: 'not_started',
  error: null,
  movieList: [],
  movieEntities: {},
};

@Injectable()
export class MovieStore extends ComponentStore<MovieState> {
  constructor(private movieService: MovieService) {
    super(initialState);
  }

  public loadingMovies$: Observable<MovieState['loadingMovies']> = this.select(
    (state) => state.loadingMovies
  );

  public loadingMovie$: Observable<MovieState['loadingMovie']> = this.select(
    (state) => state.loadingMovie
  );

  public error$: Observable<MovieState['error']> = this.select(
    (state) => state.error
  );

  public loadMovies = this.effect((action$: Observable<void>) => {
    return action$.pipe(
      tap(() => {
        this.patchState({
          loadingMovies: 'in_progress',
          error: null,
        });
      }),
      withLatestFrom(this.state$),
      switchMap(([, { query, sortBy }]) =>
        this.movieService.getMovies(query, sortBy).pipe(
          tap((res: Movie[]) => {
            this.patchState({ loadingMovies: 'success', movieList: res });
          }),
          catchError((res: HttpErrorResponse) => {
            this.patchState({
              loadingMovies: 'failed',
              error: res.error.message || 'An error occurred!',
            });

            return of([]);
          })
        )
      )
    );
  });

  public loadMovie = this.effect((action$: Observable<{ id: Movie['id'] }>) => {
    return action$.pipe(
      tap(() => {
        this.patchState({ error: null, loadingMovie: 'in_progress' });
      }),
      switchMap(({ id }) =>
        this.movieService.getMovie(id).pipe(
          tap((res: Movie) => {
            this.patchState((state) => ({
              loadingMovie: 'success',
              movieEntities: { ...state.movieEntities, [id]: res },
            }));
          }),
          catchError((res: HttpErrorResponse) => {
            this.patchState({
              loadingMovie: 'failed',
              error: res.error.message || 'An error occurred!',
            });

            return of(null);
          })
        )
      )
    );
  });

  public resetState(): void {
    this.patchState(initialState);
  }

  public selectMovies(): Observable<MovieState['movieList']> {
    return this.state$.pipe(
      filter((state) => {
        if (state.loadingMovies === 'not_started') {
          this.loadMovies();
          return false;
        }
        return true;
      }),
      map((state) => state.movieList)
    );
  }

  public selectMovie(id: Movie['id']): Observable<Movie> {
    return this.state$.pipe(
      filter((state) => {
        if (!state.movieEntities[id] && state.loadingMovie !== 'in_progress') {
          this.loadMovie({ id });
          return false;
        }
        return true;
      }),
      map((state) => state.movieEntities[id])
    );
  }
}
