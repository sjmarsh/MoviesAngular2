import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl }                    from '@angular/forms';
import { Router }                         from '@angular/router';
import { Observable }                     from 'rxjs/Observable';
import { Subject }                        from 'rxjs/Subject';
import { Store }                          from '@ngrx/store';

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
import { ReferenceDataService } from './services/reference-data.service';
import { CurrentSearch } from './models/current-search';
import { SearchCriteria } from './models/search-criteria';

import { AppState } from './reducers';
import { MovieListActions } from './actions';
import { slideRightAnimation } from './animations';

@Component({
  selector: 'movie-list',
  templateUrl: './movie.list.component.html',
  animations: [ slideRightAnimation ],
  styleUrls: [
    './app.component.css', '../assets/css/drop-down-styles.css', '../assets/css/arrow-styles.css']
})

export class MovieListComponent implements OnInit {
 
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  readonly PAGE_SIZE = 10;
  
  term = new FormControl();
  currentSearch = new CurrentSearch();
  hasResults: boolean;
  
  categories: string[];
  selectedCategories: Array<string>;

  constructor(
      private store: Store<AppState>,
      private movieListActions: MovieListActions,
      private movieService: MovieService,
      private referenceDataService: ReferenceDataService,
      private router: Router
      ){};

  ngOnInit(): void {

    this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(term => {
              this.store.dispatch(this.movieListActions.getMovies(new SearchCriteria(term, this.selectedCategories, 0, this.PAGE_SIZE)))
              this.resetPaging();
            });
           
    // setup search results
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.currentSearch = l);
  
    // initialise the search box
    let initialSearchTerm = '';
    this.store.select<CurrentSearch>('movieList').subscribe(l => initialSearchTerm = l.searchTerm);    
    let shouldSearch = this.currentSearch.movieResponse.movies == null; // only call service on page/app refresh
    this.term.setValue(initialSearchTerm, { emitEvent: shouldSearch });  

    // initialise the category selector
    this.referenceDataService.getCategories().then(result => this.categories = result);
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.selectedCategories = l.selectedCategories);
  }

  onScroll(): void {
    this.getMoreResults();
  }
 
  private resetPaging(): void {
    this.store.dispatch(this.movieListActions.resetPaging());
  }

  private getMoreResults(): void {
    let totalPages = Math.ceil(this.currentSearch.movieResponse.count / this.PAGE_SIZE);
    let hasMorePages = this.currentSearch.currentPage < totalPages;

    let skip = this.currentSearch.currentPage * this.PAGE_SIZE;
    let take = this.currentSearch.currentPage * this.PAGE_SIZE + this.PAGE_SIZE;
    let notAlreadyCalled = (skip !== this.currentSearch.lastSkipSize) && (take !== this.currentSearch.lastTakeSize);

    if(hasMorePages && notAlreadyCalled){      
      this.store.dispatch(this.movieListActions.setLastSkipSize(skip));
      this.store.dispatch(this.movieListActions.setLastTakeSize(take));
      this.store.dispatch(this.movieListActions.getMoreMovies(new SearchCriteria(this.term.value, this.selectedCategories, skip, take)));
    }
  }

  gotoDetail(movieId: number): void {
    let link = ['/detail', movieId];
    this.router.navigate(link);   
  }

  selectCategory($event, category: string): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.store.dispatch(this.movieListActions.addCategoryFilter(category));
    this.movieService.searchForMovies(this.term.value, this.selectedCategories, 0, this.PAGE_SIZE)
    .subscribe(result => {
              this.store.dispatch(this.movieListActions.getMoviesSuccess(result));
              this.resetPaging();
          });
  }

  removeCategorySelection(category: string): void {
    this.store.dispatch(this.movieListActions.removeCategoryFilter(category));
    this.movieService.searchForMovies(this.term.value, this.selectedCategories, 0, this.PAGE_SIZE)
    .subscribe(result => {
              this.store.dispatch(this.movieListActions.getMoviesSuccess(result));
              this.resetPaging();
          });
  }
}
