import { MovieResponse } from './movie.response';

export class CurrentSearch {
  
  public searchTerm : string;
  public movieResponse: MovieResponse;
  public currentPage: number;
  public lastSkipSize: number;
  public lastTakeSize: number;
  public allCategories: Array<string>;
  public selectedCategories: Array<string>;
  public selectedMovieId: number;
  public lastScrollPosition: number;
  public error: any;
  public errorMessage: string;

  public constructor(
  ){
    this.searchTerm = '';
    this.movieResponse = new MovieResponse();
    this.currentPage = 1;
    this.lastSkipSize = 0;
    this.lastTakeSize = 0;
    this.allCategories = new Array<string>();
    this.selectedCategories = new Array<string>();
    this.selectedMovieId = -1;
    this.lastScrollPosition = 0;
  }
}