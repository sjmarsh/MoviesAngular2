import {Action} from '@ngrx/store';

import {CurrentSearch} from "../models/current-search";
import {MovieListActions} from "../actions/movie.list.actions";

export type MovieListState = CurrentSearch;
const initialState: MovieListState = new CurrentSearch();

export default function (state = initialState, action: Action): MovieListState {
    switch (action.type) {

    case MovieListActions.SEARCH_BOX_TEXT_CHANGED: {
      var cs = Object.assign({}, state);
      cs.searchTerm = action.payload;
      return cs;
    }

    case MovieListActions.GET_MOVIES_SUCCESS: {
      var cs = Object.assign({}, state);
      cs.movieResponse = action.payload;
      return cs;
    }

    case MovieListActions.GET_MORE_MOVIES_SUCCESS: {
      var cs = Object.assign({}, state);
      cs.movieResponse.count = action.payload.count;
      cs.movieResponse.movies
      for(let movie of action.payload.movies){
        cs.movieResponse.movies.push(movie);
      }
      return cs;
    }

    default:
      return state;
  }
}