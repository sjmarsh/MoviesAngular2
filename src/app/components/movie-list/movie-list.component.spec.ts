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
