import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';

import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { MovieListActions } from '../actions';
import { MovieService } from '../services/movie.service';
import { ReferenceDataService } from '../services/reference-data.service';
import { SearchCriteria } from '../models/search-criteria';

@Injectable()
export class MovieListEffects{
  
  constructor(
    private movieService: MovieService,
    private referenceDataService: ReferenceDataService,
    private movieListActions: MovieListActions,
    private action$: Actions
  ){}

  @Effect() getMovies$ = this.action$
    .ofType(MovieListActions.GET_MOVIES)
    .select<SearchCriteria>(action => action.payload)
    .switchMap(criteria => this.movieService.searchForMovies(criteria.searchTerm, criteria.selectedCategories, criteria.currentSkipSize, criteria.currentTakeSize))
    .map(result => this.movieListActions.getMoviesSuccess(result), error => console.log("Error: " + error)); // todo error logging
}