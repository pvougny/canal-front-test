import { resolve } from 'path';

export class MoviesService {
  private movies: { [id: number]: Movie } = (
    require(resolve(__dirname, '..', 'movies.json')) as any[]
  ).reduce((acc, movie, id) => {
    return { ...acc, [id]: { ...movie, id, Title: String(movie.Title) } };
  }, {});

  getMovie(id: string): Movie | undefined {
    return this.movies[id]
  }

  getMovies(query?: string, sortBy?: string) {
    return Object.values(this.movies)
      .filter((movie) => !query || movie.Title.includes(query))
      .sort((a, b) => {
        return (a[sortBy || 'Title'] || a.Title) > (b[sortBy || 'Title'] || b.Title) ? 1 : -1;
      })
      .slice(0, 100);
  }
}

export interface Movie {
  id: number;
  Title: string;
  'US Gross'?: number;
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
