import { DebugElement }               from '@angular/core';
import { ComponentFixture, 
         TestBed, 
         async,
         fakeAsync,
         tick }                       from '@angular/core/testing';
import { FormControl, 
         FormsModule, 
         ReactiveFormsModule }        from '@angular/forms';
import { By }                         from '@angular/platform-browser';
import { BrowserAnimationsModule }    from '@angular/platform-browser/animations';
import { Router, RouterOutlet }       from '@angular/router';
import { RouterTestingModule }        from '@angular/router/testing';
import { InfiniteScrollModule }       from 'angular2-infinite-scroll';
import { ToasterModule,         
         ToasterContainerComponent,
         ToasterService }             from 'angular2-toaster';
import { Observable }                 from 'rxjs';
import { Store,
         StoreModule }                from '@ngrx/store';
import 'rxjs/add/operator/switchMap';

import { MovieListComponent }         from './movie-list.component';
import { ScrollerService }            from '../../services';
import { CurrentSearch }              from '../../models/current-search';
import { SearchCriteria }             from '../../models/search-criteria';
import { MovieResponse }              from '../../models/movie.response';
import { AppState }                   from '../../reducers';
import reducer                        from '../../reducers';
import { MovieListActions }           from '../../actions';
import { slideRightAnimation }        from '../../animations';

describe('MovieListComponent', ()=>{

  let comp:    MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let routerStub;
  let toasterStub;
  let movieListActions: MovieListActions;
  let scrollerService: ScrollerService;
  let store;
    
  beforeEach(async(done)=>{
    routerStub = {
      navigate([]) : Promise<boolean>{
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    };

    toasterStub = {
      pop(title, body, error) : void {}
    };
        
    spyOn(routerStub, 'navigate').and.callThrough();
    spyOn(toasterStub, 'pop').and.callThrough();
    
    TestBed.configureTestingModule({
      declarations: [ MovieListComponent ], 
      providers: [
        { provide: Store, useClass: MockStore },
        MovieListActions,
        ScrollerService,
        { provide: ToasterService, useValue: toasterStub },
        { provide: Router, useValue: routerStub }
      ],
      imports: [
        RouterTestingModule, StoreModule.provideStore(reducer), FormsModule, ReactiveFormsModule,InfiniteScrollModule,
        ToasterModule, BrowserAnimationsModule
      ]
      }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(MovieListComponent);
        comp = fixture.componentInstance; 
        movieListActions = TestBed.get(MovieListActions);
        scrollerService = TestBed.get(ScrollerService);
        done();
      }).catch(error => {
        console.error(error);
      });
    });

    describe('ngOnInit', () => {
      
      it('should set initial search term to empty', done => {     
       let store = TestBed.get(Store);
       let currentSearch = Observable.of({ movieResponse: { movies: [ ] }, error: {}, searchTerm: '' });
       spyOn(store, "select").and.returnValue(currentSearch);
       spyOn(store, "subscribe").and.returnValue(currentSearch);

       comp.ngOnInit();
                          
       fixture.detectChanges();
       expect(fixture.componentInstance.term.value).toEqual(''); 
       done();        
      });

      
      it('should should subscribe to current search', done => {     
       let store = TestBed.get(Store);
       let currentSearch = { movieResponse: { movies: [ ] }, error: {}, searchTerm: '' };
       let currentSearchObs = Observable.of(currentSearch);
       spyOn(store, "select").and.returnValue(currentSearchObs);
       spyOn(store, "subscribe").and.returnValue(currentSearchObs);

       comp.ngOnInit();
                          
       expect(store.select).toHaveBeenCalled(); 
       expect(store.subscribe).toHaveBeenCalled(); 
       expect(comp.currentSearch).toEqual(currentSearch);
       done();        
      });

      it('should get categories when categories not already loaded', done => {     
       let store = TestBed.get(Store);
       let currentSearch = { movieResponse: { movies: [ ] }, error: {}, searchTerm: '', allCategories: [] };
       let currentSearchObs = Observable.of(currentSearch);
       spyOn(store, "select").and.returnValue(currentSearchObs);
       spyOn(store, "subscribe").and.returnValue(currentSearchObs);
       spyOn(store, 'dispatch');

       comp.ngOnInit();
                          
       expect(store.dispatch).toHaveBeenCalledWith(movieListActions.getCategories());
       
       done();        
      });

      it('should not get categories when categories already loaded', done => {     
       let store = TestBed.get(Store);
       let currentSearch = { movieResponse: { movies: [ ] }, error: {}, searchTerm: '', allCategories: ['action', 'adventure'] };
       let currentSearchObs = Observable.of(currentSearch);
       spyOn(store, "select").and.returnValue(currentSearchObs);
       spyOn(store, "subscribe").and.returnValue(currentSearchObs);
       spyOn(store, 'dispatch');

       comp.ngOnInit();
                          
       expect(store.dispatch).not.toHaveBeenCalledWith(movieListActions.getCategories());
       
       done();        
      });

      it('should try to scroll to previous position', done =>{
        let selectedMovieId = 2;
        let lastScrollPosition = 500;
        let store = TestBed.get(Store);
        let currentSearch = { movieResponse: { movies: [ ] }, error: {}, searchTerm: '', allCategories: ['action', 'adventure'], selectedMovieId: selectedMovieId, lastScrollPosition: lastScrollPosition };
        let currentSearchObs = Observable.of(currentSearch);
        spyOn(store, "select").and.returnValue(currentSearchObs);
        spyOn(store, "subscribe").and.returnValue(currentSearchObs);
        spyOn(scrollerService, "tryScrollToPreviousPosition");

        comp.ngOnInit();

        expect(scrollerService.tryScrollToPreviousPosition).toHaveBeenCalledWith(`.movie-id-${selectedMovieId}`,comp.SEARCH_RESULTS_CONTAINER_NAME,lastScrollPosition, 2000);

        done();
      });
      
    });

    describe('reportError', () => {

      it('should pop toaster with supplied message', () =>{
        const message = 'oh no!';

        comp.reportError(message);

        expect(toasterStub.pop).toHaveBeenCalledWith('error', 'Movie Collection Error', message);
      });

    });

    describe('onScroll', () => {
      let fakeMovieResponse =  new MovieResponse();
      fakeMovieResponse.count = 25;
      let fakeCurrentSearch = new CurrentSearch();
      fakeCurrentSearch.movieResponse = fakeMovieResponse; 
      fakeCurrentSearch.currentPage = 1;
      fakeCurrentSearch.lastSkipSize = 0;
      fakeCurrentSearch.lastTakeSize = 0;
      
      beforeEach(() =>{
        comp.currentSearch = fakeCurrentSearch;
      });

      it('should get more movies when has more pages and not already called', ()=>{
        let store = TestBed.get(Store);
        spyOn(store, "dispatch");

        comp.onScroll();

        expect(store.dispatch.calls.all()[0].args[0]).toEqual(movieListActions.setLastSkipSize(10));
        expect(store.dispatch.calls.all()[1].args[0]).toEqual(movieListActions.setLastTakeSize(20));
        expect(store.dispatch.calls.all()[2].args[0]).toEqual(movieListActions.getMoreMovies(new SearchCriteria(null, [], 10, 20)));
      });

      it('should not get more movies when has more pages and already called', ()=>{
        comp.currentSearch.lastSkipSize = 10;
        comp.currentSearch.lastTakeSize = 20;

        let store = TestBed.get(Store);
        spyOn(store, "dispatch");

        comp.onScroll();

        expect(store.dispatch).not.toHaveBeenCalled();
      });

      it('should not get more movies when does not have more pages', ()=>{
        comp.currentSearch.movieResponse.count = 30;
        comp.currentSearch.currentPage = 3;

        let store = TestBed.get(Store);
        spyOn(store, "dispatch");

        comp.onScroll();

        expect(store.dispatch).not.toHaveBeenCalled();
      });

    });

    describe('goToDetail', ()=> {

      it('should store selected movie Id', () =>{
        const movieId = 10;
        let store = TestBed.get(Store);
        spyOn(store, "dispatch");

        comp.gotoDetail(movieId);

        expect(store.dispatch.calls.all()[0].args[0]).toEqual(movieListActions.setSelectedMovieId(movieId));
      });

      it('should store last scroll position', () =>{
        const movieId = 10;
        const lastScrollPos = 300;
        let store = TestBed.get(Store);
        spyOn(store, "dispatch");
        spyOn(scrollerService, "getScrollPositionInContainer").and.returnValue(lastScrollPos);

        comp.gotoDetail(movieId);

        expect(store.dispatch.calls.all()[1].args[0]).toEqual(movieListActions.setLastScrollPosition(lastScrollPos));
      });

      it('should navigate to movie detail for movie id', () => {
        const movieId = 10;
        const lastScrollPos = 300;
        let store = TestBed.get(Store);
        
        comp.gotoDetail(movieId);

        expect(routerStub.navigate).toHaveBeenCalledWith(['/detail', movieId]);
      });

    });

    describe('selectCategory', () => {
      let fakeEvent;
      beforeEach(() =>{
        fakeEvent = {
          stopPropagation() : void {
          },
          preventDefault() : void {
          }
        }
      });
      

      it('should stop event propagation', () =>{
        spyOn(fakeEvent, "stopPropagation");

        comp.selectCategory(fakeEvent, '');

        expect(fakeEvent.stopPropagation).toHaveBeenCalled();
      });

      it('should preventDefault event behaviour', () =>{
        spyOn(fakeEvent, "preventDefault");

        comp.selectCategory(fakeEvent, '');

        expect(fakeEvent.preventDefault).toHaveBeenCalled();
      });

      it('should store category selection', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.selectCategory(fakeEvent, category);

        expect(store.dispatch.calls.all()[0].args[0]).toEqual(movieListActions.addCategoryFilter(category));
      });

      it('should get movies for selected category', () =>{
        const category = 'action';
        comp.currentSearch.selectedCategories = [category];
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.selectCategory(fakeEvent, category);

        expect(store.dispatch.calls.all()[1].args[0]).toEqual(movieListActions.getMovies(new SearchCriteria(null, [category], 0, 10)));
      });

      it('should scroll to top of container', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');
        spyOn(scrollerService, 'scrollToTopOfContainer');

        comp.selectCategory(fakeEvent, category);

        expect(scrollerService.scrollToTopOfContainer).toHaveBeenCalledWith(comp.SEARCH_RESULTS_CONTAINER_NAME);
      });

      it('should reset paging', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.selectCategory(fakeEvent, category);

        expect(store.dispatch.calls.all()[2].args[0]).toEqual(movieListActions.resetPaging());
      })

    });

    describe('removeCategorySelection', () => {

      it('should remove category selection from store', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.removeCategorySelection(category);

        expect(store.dispatch.calls.all()[0].args[0]).toEqual(movieListActions.removeCategoryFilter(category));
      });

      it('should get movies for remaining categories', () =>{
        const category = 'action';
        comp.currentSearch.selectedCategories = [];
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.removeCategorySelection(category);

        expect(store.dispatch.calls.all()[1].args[0]).toEqual(movieListActions.getMovies(new SearchCriteria(null, [], 0, 10)));
      });

      it('should scroll to top of container', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');
        spyOn(scrollerService, 'scrollToTopOfContainer');

        comp.removeCategorySelection(category);

        expect(scrollerService.scrollToTopOfContainer).toHaveBeenCalledWith(comp.SEARCH_RESULTS_CONTAINER_NAME);
      });

      it('should reset paging', () => {
        const category = 'action';
        let store = TestBed.get(Store);
        spyOn(store, 'dispatch');

        comp.removeCategorySelection(category);

        expect(store.dispatch.calls.all()[2].args[0]).toEqual(movieListActions.resetPaging());
      })
      
    });

});

class MockStore {
  public dispatch(obj) {
    console.log('dispatching from the mock store!');
  }

  public select(obj) {
    console.log('selecting from the mock store!');

    return Observable.of({});
  }

  public subscribe(obj){
    console.log('subscribing to the mock store!');
    return Observable.of({});
  }
}
