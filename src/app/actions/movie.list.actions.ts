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

  static SET_CURRENT_PAGE = '[Paging] Set Current Page';
  setCurrentPage(currentPage: number) : Action {
    return {
      type: MovieListActions.SET_CURRENT_PAGE,
      payload: currentPage
    };
  }

  static INCREMENT_CURRENT_PAGE = '[Paging] Increment Current Page';
  incrementCurrentPage() : Action {
    return {
      type: MovieListActions.INCREMENT_CURRENT_PAGE
    };
  }

  static SET_LAST_SKIP_SIZE = '[Paging] Set Last Skip Size';
  setLastSkipSize(lastSkipSize: number) : Action {
    return {
      type: MovieListActions.SET_LAST_SKIP_SIZE,
      payload: lastSkipSize
    };
  }

  static SET_LAST_TAKE_SIZE = '[Paging] Set Last Take Size';
  setLastTakeSize(lastTakeSize: number) : Action {
    return {
      type: MovieListActions.SET_LAST_TAKE_SIZE,
      payload: lastTakeSize
    };
  }

  static RESET_PAGING = '[Paging] Reset Paging';
  resetPaging() : Action {
    return {
      type: MovieListActions.RESET_PAGING
    };
  }
}