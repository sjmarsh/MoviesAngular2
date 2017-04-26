import {Action} from '@ngrx/store';

import {CurrentSearch} from "../models/current-search";
import {MovieListActions} from "../actions/movie.list.actions";

export type MovieListState = CurrentSearch;
const initialState: MovieListState = new CurrentSearch();

export default function (state = initialState, action: Action): MovieListState {
    switch (action.type) {
    
    case MovieListActions.GET_MOVIES: {
      let cs = Object.assign({}, state); 
      cs.searchTerm = action.payload.searchTerm;
      cs.selectedCategories = action.payload.selectedCategories;
      cs.lastTakeSize = action.payload.currentTakeSize;
      cs.lastSkipSize = action.payload.currentSkipSize;
      cs.isLoading = true;
      return cs;
    }

    case MovieListActions.GET_MOVIES_SUCCESS: {
      let cs = Object.assign({}, state);
      cs.movieResponse = action.payload;
      cs.isLoading = false;
      return cs;
    }

    case MovieListActions.GET_MOVIES_FAILURE: {
      let cs = Object.assign({}, state);
      cs.error = action.payload;
      cs.errorMessage = "An Error occured retrieving movies.";
      cs.isLoading = false;
      return cs;
    }

    case MovieListActions.GET_MORE_MOVIES: {
      let cs = Object.assign({}, state); 
      cs.searchTerm = action.payload.searchTerm;
      cs.selectedCategories = action.payload.selectedCategories;
      cs.lastTakeSize = action.payload.currentTakeSize;
      cs.lastSkipSize = action.payload.currentSkipSize;
      cs.isLoading = true;
      return cs;
    }

    case MovieListActions.GET_MORE_MOVIES_SUCCESS: {
      let cs = Object.assign({}, state);
      cs.movieResponse.count = action.payload.count;
      for(let movie of action.payload.movies){
        cs.movieResponse.movies.push(movie);
      }
      cs.currentPage = cs.currentPage + 1;
      cs.isLoading = false;
      return cs;
    }

    case MovieListActions.GET_MORE_MOVIES_FAILURE: {
      let cs = Object.assign({}, state);
      cs.error = action.payload;
      cs.errorMessage = "An Error occured retrieving movies.";
      cs.isLoading = false;
      return cs;
    }

    case MovieListActions.SET_CURRENT_PAGE: {
      let cs = Object.assign({}, state);
      cs.currentPage = action.payload;
      return cs;
    }

    case MovieListActions.SET_LAST_SKIP_SIZE: {
      let cs = Object.assign({}, state);
      cs.lastSkipSize = action.payload;
      return cs;
    }

    case MovieListActions.SET_LAST_TAKE_SIZE: {
      let cs = Object.assign({}, state);
      cs.lastTakeSize = action.payload;
      return cs;
    }

    case MovieListActions.RESET_PAGING: {
      let cs = Object.assign({}, state);
      cs.currentPage = 1;
      cs.lastSkipSize = 0;
      cs.lastTakeSize = 0;
      return cs;
    }

    case MovieListActions.GET_CATEGORIES: {  
      // nothing happening yet - could be used for loading animation?
      return state;
    }

    case MovieListActions.GET_CATEGORIES_SUCCESS: {
      let cs = Object.assign({}, state);
      cs.allCategories = action.payload;
      return cs;
    }

    case MovieListActions.GET_CATEGORIES_FAILURE: {
      let cs = Object.assign({}, state);
      cs.error = action.payload;
      cs.errorMessage = 'An error occured retrieving Category Selections.'
      return cs;
    }

    case MovieListActions.ADD_CATEGORY_FILTER: {
      let cs = Object.assign({}, state);
      var index = cs.selectedCategories.indexOf(action.payload);
      if(index === -1){
        cs.selectedCategories.push(action.payload);
      }
      return cs;
    }

    case MovieListActions.REMOVE_CATEGORY_FILTER: {
      let cs = Object.assign({}, state);
      var index = cs.selectedCategories.indexOf(action.payload);
      if(index > -1){
        cs.selectedCategories.splice(index, 1);
      }
      return cs;
    }

    case MovieListActions.SET_SELECTED_MOVIE_ID: {
      let cs = Object.assign({}, state);
      cs.selectedMovieId = action.payload;
      return cs;
    }

    case MovieListActions.SET_LAST_SCROLL_POSITION: {
      let cs = Object.assign({}, state);
      cs.lastScrollPosition = action.payload;
      return cs;
    }

    default:
      return state;
  }
}