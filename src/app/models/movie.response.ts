import { Observable }           from 'rxjs/Observable';

import { Movie } from './movie';

export class MovieResponse{
  movies: Array<Movie>;
  count: number;
}