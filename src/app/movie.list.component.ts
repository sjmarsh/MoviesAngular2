import { Component, OnInit }    from '@angular/core';
import { FormControl }          from '@angular/forms';
import { Router }               from '@angular/router';
import { Observable }           from 'rxjs/Observable';
import { Subject }              from 'rxjs/Subject';
import { Store }                from '@ngrx/store';

// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchmap';

import { Movie } from './models/movie';
import { MovieResponse } from './models/movie.response';
import { MovieService } from './services/movie.service';
import { CurrentSearch } from './models/current-search';

import {AppState} from './reducers';
import {MovieListActions} from './actions';

@Component({
  selector: 'movie-list',
  templateUrl: './movie.list.component.html',
  styleUrls: [
    './app.component.css']
})

export class MovieListComponent implements OnInit {
 
  readonly PAGE_SIZE = 10;
  
  term = new FormControl();
  searchResult = new MovieResponse();
  hasResults: boolean;
  currentPage = 1;
  lastSkip: number;
  lastTake: number;
      
  constructor(
      private store: Store<AppState>,
      private movieListActions: MovieListActions,
      private movieService: MovieService,
      private router: Router
      ){
  };

  ngOnInit(): void {
    
    this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.movieService.searchForMovies(term, 0, this.PAGE_SIZE))
            .subscribe(result => this.store.dispatch(this.movieListActions.getMoviesSuccess(result)));
    
    // initialise the search box
    var initialSearchTerm = '';
    this.store.select<CurrentSearch>('movieList').subscribe(l => initialSearchTerm = l.searchTerm);    
    this.term.setValue(initialSearchTerm); 

    // setup the search hasResults
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.searchResult = l.movieResponse);
  }

  onScroll(): void {
    this.getMoreResults();
  }
 
  private updateSearchResult(searchResult: MovieResponse){
    this.searchResult = searchResult;
    this.hasResults = this.searchResult.movies.length > 0; 
    this.currentPage = 1;
    this.lastSkip = 0;
    this.lastTake = 0;
  }

  private getMoreResults(): void {
    
    var totalPages = Math.ceil(this.searchResult.count / this.PAGE_SIZE);
    var hasMorePages = this.currentPage < totalPages;

    var skip = this.currentPage * this.PAGE_SIZE;
    var take = this.currentPage * this.PAGE_SIZE + this.PAGE_SIZE;
    var notAlreadyCalled = (skip !== this.lastSkip) && (take !== this.lastTake);

    if(hasMorePages && notAlreadyCalled){      
      this.lastSkip = skip;
      this.lastTake = take;

      this.movieService.searchForMovies(this.term.value, skip, take)
        .subscribe(result => this.store.dispatch(this.movieListActions.getMoreMoviesSuccess(result)));
      
      this.currentPage = this.currentPage + 1;
    }
  }

  gotoDetail(movieId: number): void {
    
    // store current search 
    this.store.dispatch(this.movieListActions.searchBoxTextChanged(this.term.value));
    
    let link = ['/detail', movieId];
    this.router.navigate(link);   
  }

}
