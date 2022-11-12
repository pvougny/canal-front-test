import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, switchMap, Subject } from 'rxjs';
import { Movie } from 'src/app/services/movie.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { MovieState, MovieStore } from 'src/app/stores/movie.store';

interface Data {
  key: keyof Movie;
  value: string;
}

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss'],
})
export class MovieComponent implements OnDestroy {
  private _destroy$: Subject<void> = new Subject();

  private _fields: (keyof Movie)[] = [
    'Title',
    'Director',
    'US Gross',
    'US DVD Sales',
    'Worldwide Gross',
    'Production Budget',
    'Release Date',
    'Distributor',
    'Major Genre',
    'IMDB Rating',
    'IMDB Votes',
    'Rotten Tomatoes Rating',
  ];

  public loadingMovie$: Observable<MovieState['loadingMovie']> =
    this.movieStore.loadingMovie$;
  public error$: Observable<MovieState['error']> = this.movieStore.error$;

  private _movie$: Observable<Movie> = this.route.params.pipe(
    switchMap((params) => this.movieStore.selectMovie(params['id']))
  );

  public title$: Observable<Movie['Title']> = this._movie$.pipe(
    map((movie) => movie?.['Title'] || '')
  );

  public fields$: Observable<Data[]> = this._movie$.pipe(
    map((movie: Movie | null) =>
      movie
        ? this._fields.map((key) => ({
            key,
            value: `${movie[key]}`,
          }))
        : []
    )
  );

  constructor(
    private authStore: AuthStore,
    private movieStore: MovieStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public back(): void {
    this.router.navigate(['/movies']);
  }

  public logout(): void {
    this.authStore.logout();
    this.router.navigate(['/login']);
  }
}
