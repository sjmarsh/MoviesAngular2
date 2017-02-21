import { Injectable }   from '@angular/core';
import { Action }       from '@ngrx/store';

import { MovieResponse } from '../models/movie.response';

@Injectable()
export class MovieListActions {
  
  static SEARCH_BOX_TEXT_CHANGED = '[SearchBox] Text Changed';
  searchBoxTextChanged(searchTerm: string): Action {
    return {
      type: MovieListActions.SEARCH_BOX_TEXT_CHANGED,
      payload: searchTerm
    };
  }

  static GET_MOVIES_SUCCESS = '[GetMovies] Success';
  getMoviesSuccess(result: MovieResponse) : Action {
    return {
      type: MovieListActions.GET_MOVIES_SUCCESS,
      payload: result
    };
  }

  static GET_MORE_MOVIES_SUCCESS = '[GetMoreMovies] Success';
  getMoreMoviesSuccess(result: MovieResponse) : Action {
    return {
      type: MovieListActions.GET_MORE_MOVIES_SUCCESS,
      payload: result
    }
  }

}