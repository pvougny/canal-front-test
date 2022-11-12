import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Movie {
  id: number;
  Title: string;
  'US Gross'?: number;
  'US DVD Sales'?: number;
  'Worldwide Gross'?: number;
  'Production Budget'?: number;
  'Release Date'?: string;
  Distributor?: string;
  'IMDB Rating'?: number;
  'IMDB Votes'?: number;
  'Major Genre'?: string;
  Director?: string;
  'Rotten Tomatoes Rating'?: string;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private httpClient: HttpClient) {}

  public getMovies(
    query?: string,
    sortBy?: keyof Movie | null
  ): Observable<Movie[]> {
    return this.httpClient.get<Movie[]>(`${environment.api}/movies`, {
      params: {
        ...(query && { query }),
        ...(sortBy && { sortBy }),
      },
    });
  }

  public getMovie(id: Movie['id']): Observable<Movie> {
    return this.httpClient.get<Movie>(`${environment.api}/movies/${id}`);
  }
}
