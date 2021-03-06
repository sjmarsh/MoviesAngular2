import { Component, OnInit, HostBinding } from '@angular/core';
import { FormControl }                    from '@angular/forms';
import { Router }                         from '@angular/router';
import { Observable }                     from 'rxjs/Observable';
import { Subject }                        from 'rxjs/Subject';
import { Store }                          from '@ngrx/store';
import { ToasterService }                 from 'angular2-toaster';

// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { ScrollerService }      from '../../services';
import { CurrentSearch }        from '../../models/current-search';
import { SearchCriteria }       from '../../models/search-criteria';

import { AppState }             from '../../reducers';
import { MovieListActions }     from '../../actions';
import { slideRightAnimation }  from '../../animations';

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  animations: [ slideRightAnimation ],
  styleUrls: [
    './movie-list.component.css', '../../../assets/css/drop-down-styles.css', '../../../assets/css/arrow-styles.css']
})

export class MovieListComponent implements OnInit {
 
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';

  readonly PAGE_SIZE = 10;
  readonly SEARCH_RESULTS_CONTAINER_NAME = 'search-results';

  term = new FormControl();
  currentSearch = new CurrentSearch();
  
  constructor(
      private store: Store<AppState>,
      private movieListActions: MovieListActions,     
      private scrollerService: ScrollerService,
      private toaster: ToasterService,
      private router: Router
      ){};

  ngOnInit(): void {
    // initialise the search box
    this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(term => {
              this.store.dispatch(this.movieListActions.getMovies(new SearchCriteria(term, this.currentSearch.selectedCategories, 0, this.PAGE_SIZE)))
              this.resetPaging();
            });
           
    // restore current search state
    this.store.select<CurrentSearch>('movieList').subscribe(l => this.currentSearch = l);
    this.store.subscribe(s => this.reportError(s.movieList.errorMessage));

    // initialise the category selector
    if(this.currentSearch.allCategories && this.currentSearch.allCategories.length === 0){
      this.store.dispatch(this.movieListActions.getCategories());
    }

    // trigger initial search
    let initialSearchTerm = '';
    this.store.select<CurrentSearch>('movieList').subscribe(l => initialSearchTerm = l.searchTerm);
    let shouldSearch = this.currentSearch.movieResponse.movies == null; // only call service on page/app refresh
    this.term.setValue(initialSearchTerm, { emitEvent: shouldSearch });      

    // restore the previous scroll position on navigating back
    this.tryScrollToPreviousPosition();
  }

  private tryScrollToPreviousPosition() : void {
    let selectedMovieId = this.currentSearch.selectedMovieId;
    let lastScrollPosition = this.currentSearch.lastScrollPosition;
    let classToWaitFor = `.movie-id-${selectedMovieId}`;
    let timeout = 2000; 
    if(selectedMovieId !== -1){
      this.scrollerService.tryScrollToPreviousPosition(classToWaitFor, this.SEARCH_RESULTS_CONTAINER_NAME, lastScrollPosition, timeout)
    }
  }

  reportError(errorMessage){
    if(errorMessage){
      this.toaster.pop('error', 'Movie Collection Error', errorMessage);
    }
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
      this.store.dispatch(this.movieListActions.getMoreMovies(new SearchCriteria(this.term.value, this.currentSearch.selectedCategories, skip, take)));
    }
  }

  gotoDetail(movieId: number): void {
    this.store.dispatch(this.movieListActions.setSelectedMovieId(movieId));
    let lastScrollPosition = this.scrollerService.getScrollPositionInContainer('search-results');;
    this.store.dispatch(this.movieListActions.setLastScrollPosition(lastScrollPosition));
    let link = ['/detail', movieId];
    this.router.navigate(link);   
  }

  selectCategory($event, category: string): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.store.dispatch(this.movieListActions.addCategoryFilter(category));
    this.store.dispatch(this.movieListActions.getMovies(new SearchCriteria(this.term.value, this.currentSearch.selectedCategories, 0, this.PAGE_SIZE)))
    this.scrollerService.scrollToTopOfContainer(this.SEARCH_RESULTS_CONTAINER_NAME);
    this.resetPaging();
  }

  removeCategorySelection(category: string): void {
    this.store.dispatch(this.movieListActions.removeCategoryFilter(category));
    this.store.dispatch(this.movieListActions.getMovies(new SearchCriteria(this.term.value, this.currentSearch.selectedCategories, 0, this.PAGE_SIZE)))
    this.scrollerService.scrollToTopOfContainer(this.SEARCH_RESULTS_CONTAINER_NAME);
    this.resetPaging();
  }
}
