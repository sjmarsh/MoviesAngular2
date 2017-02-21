import { MovieResponse } from './movie.response';

export class CurrentSearch {
  
  public searchTerm : string;
  public movieResponse: MovieResponse;

  public constructor(){
    this.searchTerm = '';
    this.movieResponse = new MovieResponse();
  }
}