import { Injectable }   from '@angular/core';
import { Action }       from '@ngrx/store';

import { MovieResponse } from '../models/movie.response';
import { SearchCriteria } from '../models/search-criteria';

@Injectable()
export class MovieListActions {
    
  static GET_MOVIES = '[GetMovies] Request';
  getMovies(searchCriteria: SearchCriteria) : Action {
    return{
      type: MovieListActions.GET_MOVIES,
      payload: searchCriteria
    };
  }

  static GET_MOVIES_SUCCESS = '[GetMovies] Success';
  getMoviesSuccess(result: MovieResponse) : Action {
    return {
      type: MovieListActions.GET_MOVIES_SUCCESS,
      payload: result
    };
  }

  static GET_MORE_MOVIES = '[GetMoreMovies] Request';
  getMoreMovies(searchCriteria: SearchCriteria) : Action {
    return {
      type: MovieListActions.GET_MORE_MOVIES,
      payload: searchCriteria
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

  static GET_CATEGORIES = '[Categories] - Get Request';
  getCategories() : Action {
    return {
      type: MovieListActions.GET_CATEGORIES
    };
  }

  static GET_CATEGORIES_SUCCESS = '[Categories] - Get Success';
  getCategoriesSuccess(categories: Array<string>) : Action {
    return{
      type: MovieListActions.GET_CATEGORIES_SUCCESS,
      payload: categories
    }
  }

  static ADD_CATEGORY_FILTER = '[Categories] Add Filter';
  addCategoryFilter(category: string) : Action {
    return {
      type: MovieListActions.ADD_CATEGORY_FILTER,
      payload: category
    }
  }

  static REMOVE_CATEGORY_FILTER = '[Categories] Remove Filter';
  removeCategoryFilter(category: string) : Action {
    return {
      type: MovieListActions.REMOVE_CATEGORY_FILTER,
      payload: category
    }
  }

  static SET_SELECTED_MOVIE_ID = '[SelectedMovie] Set Id';
  setSelectedMovieId(movieId: number) : Action {
    return {
      type: MovieListActions.SET_SELECTED_MOVIE_ID,
      payload: movieId
    };
  }

  static SET_LAST_SCROLL_POSITION = '[ScrollPosition] Set Last';
  setLastScrollPosition(position: number) : Action {
    return {
      type: MovieListActions.SET_LAST_SCROLL_POSITION,
      payload: position
    }
  }

}