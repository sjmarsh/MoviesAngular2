import {Action} from '@ngrx/store';

import {CurrentSearch} from "../models/current-search";
import {MovieListActions} from "../actions/movie.list.actions";

export type MovieListState = CurrentSearch;
const initialState: MovieListState = new CurrentSearch();

export default function (state = initialState, action: Action): MovieListState {
    switch (action.type) {

    case MovieListActions.SEARCH_BOX_TEXT_CHANGED: {
      var cs = new CurrentSearch();
      cs.searchTerm = action.payload;
      return cs;
    }

    default:
      return state;
  }
}