import { MovieResponse } from './movie.response';

export class CurrentSearch {
  
  public searchTerm : string;
  public movieResponse: MovieResponse;
  public currentPage: number;
  public lastSkipSize: number;
  public lastTakeSize: number;

  public constructor(){
    this.searchTerm = '';
    this.movieResponse = new MovieResponse();
    this.currentPage = 1;
    this.lastSkipSize = 0;
    this.lastTakeSize = 0;
  }
}