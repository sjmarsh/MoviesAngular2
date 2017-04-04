import { TestBed, inject }          from '@angular/core/testing';
import { Actions, Effect }          from '@ngrx/effects';
import { Injectable }               from '@angular/core';
import { EffectsTestingModule, 
         EffectsRunner }            from '@ngrx/effects/testing';
import 'rxjs/add/observable/of';
import { Observable }               from 'rxjs/Observable';

import { MovieListEffects }         from './';

import { MovieListActions }         from '../actions';
import { MovieService,
         ReferenceDataService }     from '../services';
import { Movie, 
         MovieResponse,
         SearchCriteria }           from '../models';


describe('Movie List Effects', () => {
    let runner: EffectsRunner;
    let effects: MovieListEffects;
    let movieListActions = new MovieListActions();
    let fakeMovie = new Movie();
    let fakeMovieResponse = new MovieResponse();
    let fakeCategories = ['action', 'adventure'];
    
    let movieServiceStub = {
      searchForMoviesWithCriteria(criteria: SearchCriteria) : Observable<MovieResponse> {
        return Observable.of(fakeMovieResponse);
      }
    };

    let referenceDataServiceStub = {
      getCategories() : Promise<string[]>{
          return new Promise((resolve, reject)=>{
              resolve(fakeCategories);
          })
      }
    };
   
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                EffectsTestingModule
            ],
            providers: [
              { provide: MovieService, useValue: movieServiceStub },
              { provide: ReferenceDataService, useValue: referenceDataServiceStub },
              MovieListActions,
              MovieListEffects
            ]
        });
    });

    beforeEach(inject([ EffectsRunner, MovieListEffects ],
        ( effectsRunner: EffectsRunner, movieListEffects: MovieListEffects) => {
            runner = effectsRunner;
            effects = movieListEffects;
        }));

    it('should return a GET_MOVIE_SUCCESS action after getting movies successfully', () => {
      runner.queue({ type: MovieListActions.GET_MOVIES });

      effects.getMovies$.subscribe(result => {
            expect(result).toEqual(movieListActions.getMoviesSuccess(fakeMovieResponse));
        });
    });

    it('should return a GET_MOVIES_FAILURE action after failing to get movies', () => {
        let errorMessage = 'Oh No!!!';
        var fakeMovieService = TestBed.get(MovieService);
        spyOn(fakeMovieService, 'searchForMoviesWithCriteria').and.throwError(errorMessage);

        runner.queue({ type: MovieListActions.GET_MOVIES });

        effects.getMovies$.subscribe(result => {
            expect(result.type).toEqual(MovieListActions.GET_MOVIES_FAILURE);
            expect(result.payload.toString()).toEqual('Error: ' + errorMessage);
        });
    });

    it('should return a GET_MORE_MOVIES_SUCCESS action after getting more movies successfully', () => {
      runner.queue({ type: MovieListActions.GET_MORE_MOVIES });

      effects.getMoreMovies$.subscribe(result => {
            expect(result).toEqual(movieListActions.getMoreMoviesSuccess(fakeMovieResponse));
        });
    });

    it('should return a GET_MORE_MOVIES_FAILURE action after failing to get more movies', () => {
        let errorMessage = 'Oh No!!!';
        var fakeMovieService = TestBed.get(MovieService);
        spyOn(fakeMovieService, 'searchForMoviesWithCriteria').and.throwError(errorMessage);

        runner.queue({ type: MovieListActions.GET_MORE_MOVIES });

        effects.getMoreMovies$.subscribe(result => {
            expect(result.type).toEqual(MovieListActions.GET_MORE_MOVIES_FAILURE);
            expect(result.payload.toString()).toEqual('Error: ' + errorMessage);
        });
    });

    it('should return a GET_CATEGORIES_SUCCESS action after getting categories successfully', () => {
      runner.queue({ type: MovieListActions.GET_CATEGORIES });

      effects.getCategories$.subscribe(result => {
            expect(result).toEqual(movieListActions.getCategoriesSuccess(fakeCategories));
        });
    });

    it('should return a GET_CATEGORIES_FAILURE action after failing to get Categories', () => {
      let errorMessage = 'Oh Dear!';
      let fakeRefDataService = TestBed.get(ReferenceDataService);
      spyOn(fakeRefDataService, 'getCategories').and.throwError(errorMessage);  
      runner.queue({ type: MovieListActions.GET_CATEGORIES });

      effects.getCategories$.subscribe(result => {
            expect(result.type).toEqual(MovieListActions.GET_CATEGORIES_FAILURE);
            expect(result.payload.toString()).toEqual('Error: ' + errorMessage);
        });
    });
});