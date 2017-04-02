import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By }                               from '@angular/platform-browser';
import { DebugElement }                     from '@angular/core';
import { RouterTestingModule }              from '@angular/router/testing';
import { tick, fakeAsync }                  from '@angular/core/testing';
import { ActivatedRoute, Params }           from '@angular/router';
import { Router, RouterOutlet }             from '@angular/router';

import { Observable }                       from 'rxjs';
import 'rxjs/add/operator/switchMap';

import { MovieDetailComponent }             from './movie-detail.component';
import { MovieService, ScrollerService }    from '../../services';
import { Movie }                            from '../../Models/movie';


describe('MovieDetailComponent', () => {

  let comp:    MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  
  let movieId = 123;
  let fakeMovie = <Movie>{ id: movieId, title: 'Superman' };  
  let movieService: MovieService;
  let movieServiceStub;
  let scrollerService: ScrollerService;
  let routeStub;
  let routerStub;

  beforeEach(async(() => {

    routeStub = { 
      params: Observable.of({id: movieId})
    };

    routerStub = {
      navigate([]) : Promise<boolean>{
        return new Promise((resolve, reject) => {
          resolve();
        })
      }
    };

    movieServiceStub = {
      getMovie(movieId: number) : Promise<Movie>{     
        return new Promise((resolve, reject) => {
          resolve(fakeMovie);
        })
      }
    };

    spyOn(movieServiceStub, 'getMovie').and.callThrough();
    spyOn(routerStub, 'navigate').and.callThrough();
    
    TestBed.configureTestingModule({
      declarations: [ MovieDetailComponent ], // declare the test component
      providers: [
        { provide: MovieService, useValue: movieServiceStub },
        ScrollerService,
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: Router, useValue: routerStub }
      ],
      imports: [RouterTestingModule]
    }).compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(MovieDetailComponent);
      comp = fixture.componentInstance; // MovieDetailComponent test instance
      movieService = TestBed.get(MovieService);
      scrollerService = TestBed.get(ScrollerService);
    });
  }));

  describe('ngOnInit', () => {
    it('should get movie with movieId from params', () => {
      comp.ngOnInit();
      expect(movieServiceStub.getMovie).toHaveBeenCalledWith(movieId);
    });

    it('should set movie to value returned from service', <any>fakeAsync((): void => {    
      comp.ngOnInit();
      tick(50);
      expect(comp.movieDetail).toBe(fakeMovie);
    }));

    it('should scroll to top', () => {
      spyOn(scrollerService, 'scrollToTop');
      comp.ngOnInit();
      expect(scrollerService.scrollToTop).toHaveBeenCalled();
    })
  });
  
  describe('backToList', ()=> {
    it('should navigate home', () => {
      comp.backToList();
      expect(routerStub.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

});
