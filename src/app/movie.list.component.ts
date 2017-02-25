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
            .subscribe(result => {
              this.store.dispatch(this.movieListActions.getMoviesSuccess(result));
              this.resetPaging();
          });
    
    // setup search results
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.searchResult = l.movieResponse);
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.currentPage = l.currentPage);
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.lastSkip = l.lastSkipSize);
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.lastTake = l.lastTakeSize);

    // initialise the search box
    let initialSearchTerm = '';
    this.store.select<CurrentSearch>('movieList').subscribe(l => initialSearchTerm = l.searchTerm);    
    let shouldSearch = this.searchResult.movies == null; // only call service on page/app refresh
    this.term.setValue(initialSearchTerm, { emitEvent: shouldSearch });     
  }

  onScroll(): void {
    this.getMoreResults();
  }
 
  private resetPaging(): void {
    this.store.dispatch(this.movieListActions.resetPaging());
  }

  private getMoreResults(): void {
    let totalPages = Math.ceil(this.searchResult.count / this.PAGE_SIZE);
    let hasMorePages = this.currentPage < totalPages;

    let skip = this.currentPage * this.PAGE_SIZE;
    let take = this.currentPage * this.PAGE_SIZE + this.PAGE_SIZE;
    let notAlreadyCalled = (skip !== this.lastSkip) && (take !== this.lastTake);

    if(hasMorePages && notAlreadyCalled){      
      this.store.dispatch(this.movieListActions.setLastSkipSize(skip));
      this.store.dispatch(this.movieListActions.setLastTakeSize(take));
     
      this.movieService.searchForMovies(this.term.value, skip, take)
        .subscribe(result => {
          this.store.dispatch(this.movieListActions.getMoreMoviesSuccess(result));
          this.store.dispatch(this.movieListActions.incrementCurrentPage());
        }
      );
    }
  }

  gotoDetail(movieId: number): void {
    // store current search 
    this.store.dispatch(this.movieListActions.searchBoxTextChanged(this.term.value));
    
    let link = ['/detail', movieId];
    this.router.navigate(link);   
  }

}
