import { Action }           from '@ngrx/store';

//import { MovieListState }   from './movie.list.reducer';
import movieListReducer, * as fromMovieList from './movie.list.reducer';

import { MovieListActions } from "../actions/movie.list.actions";
import { CurrentSearch,     
         SearchCriteria,   
         MovieResponse }    from "../models";

fdescribe('Movie List Reducer', () => {

  let actions: MovieListActions;
  let state: fromMovieList.MovieListState;

  beforeEach(() => {
    actions = new MovieListActions();
    state = new CurrentSearch();
  });

  it('GET_MOVIES - Should Update state with search criteria', ()=> {
    let searchCriteria = new SearchCriteria('super', ['action'], 0, 10);
    
    let result = movieListReducer(state, actions.getMovies(searchCriteria))

    expect(result.searchTerm).toEqual(searchCriteria.searchTerm);
    expect(result.selectedCategories).toEqual(searchCriteria.selectedCategories);
    expect(result.lastTakeSize).toEqual(searchCriteria.currentTakeSize);
    expect(result.lastSkipSize).toEqual(searchCriteria.currentSkipSize);
  });

  it('GET_MOVIES_SUCCESS - Should update state with get movie response', () => {
    let movieResponse = new MovieResponse();

    let result = movieListReducer(state, actions.getMoviesSuccess(movieResponse))

    expect(result.movieResponse).toEqual(movieResponse);
  });

});
