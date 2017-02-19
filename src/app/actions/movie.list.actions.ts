import {Injectable} from '@angular/core';
import {Action} from '@ngrx/store';


@Injectable()
export class MovieListActions {
  
  static SEARCH_BOX_TEXT_CHANGED = '[SearchBox] Text Changed';
  searchBoxTextChanged(searchTerm): Action {
  
    return {
      type: MovieListActions.SEARCH_BOX_TEXT_CHANGED,
      payload: searchTerm
    };
  }

}