import { Action }           from '@ngrx/store';

import movieListReducer, * as fromMovieList from './movie.list.reducer';

import { MovieListActions } from "../actions/movie.list.actions";
import { CurrentSearch,     
         SearchCriteria,
         Movie,   
         MovieResponse }    from "../models";

describe('Movie List Reducer', () => {

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
    expect(result.isLoading).toBeTruthy();
  });

  it('GET_MOVIES_SUCCESS - Should update state with get movie response', () => {
    let movieResponse = new MovieResponse();

    let result = movieListReducer(state, actions.getMoviesSuccess(movieResponse))

    expect(result.movieResponse).toEqual(movieResponse);
  });

  it('GET_MOVIES_FAILURE - Should update state with get movie error response', () => {
    let error = 'oh no!';

    let result = movieListReducer(state, actions.getMoviesFailure(error));

    expect(result.error).toEqual(error);
    expect(result.errorMessage).toEqual("An Error occured retrieving movies.");
  });

  it('GET_MORE_MOVIES - Should Update state with search criteria', ()=> {
    let searchCriteria = new SearchCriteria('super', ['action'], 0, 10);
    
    let result = movieListReducer(state, actions.getMoreMovies(searchCriteria))

    expect(result.searchTerm).toEqual(searchCriteria.searchTerm);
    expect(result.selectedCategories).toEqual(searchCriteria.selectedCategories);
    expect(result.lastTakeSize).toEqual(searchCriteria.currentTakeSize);
    expect(result.lastSkipSize).toEqual(searchCriteria.currentSkipSize);
    expect(result.isLoading).toBeTruthy();
  });

  it('GET_MORE_MOVIES_SUCCESS - Should update state with get more movies response', () => {
    let initialState = new CurrentSearch();
    initialState.movieResponse = new MovieResponse();
    initialState.movieResponse.movies = [new Movie()];   
    let movieCount = 10;
    let movieResponse = new MovieResponse();
    movieResponse.movies = [new Movie()];
    movieResponse.count = movieCount;
    
    let result = movieListReducer(initialState, actions.getMoreMoviesSuccess(movieResponse))

    expect(result.movieResponse.movies).toEqual([new Movie(), new Movie()]);
    expect(result.movieResponse.count).toEqual(movieCount);
    expect(result.isLoading).toBeFalsy();
  });

  it('GET_MORE_MOVIES_FAILURE - Should update state with get movie error response', () => {
    let error = 'oh no!';

    let result = movieListReducer(state, actions.getMoreMoviesFailure(error));

    expect(result.error).toEqual(error);
    expect(result.errorMessage).toEqual("An Error occured retrieving movies.");
    expect(result.isLoading).toBeFalsy();
  });

  it('SET_CURRENT_PAGE - Should update state with current page', () => {
    let currentPage = 3;

    let result = movieListReducer(state, actions.setCurrentPage(currentPage));

    expect(result.currentPage).toBe(currentPage);
  });

  it('SET_LAST_SKIP_SIZE - Should update state with last skip size', () => {
    let lastSkipSize = 10;

    let result = movieListReducer(state, actions.setLastSkipSize(lastSkipSize));

    expect(result.lastSkipSize).toBe(lastSkipSize);
  })

  it('SET_LAST_TAKE_SIZE - Should update state with last take size', () => {
    let lastTakeSize = 10;

    let result = movieListReducer(state, actions.setLastTakeSize(lastTakeSize));

    expect(result.lastTakeSize).toBe(lastTakeSize);
  });

  it('RESET_PAGING - Should reset paging to initial values', () => {
    
    let result = movieListReducer(state, actions.resetPaging());

    expect(result.currentPage).toBe(1);
    expect(result.lastTakeSize).toBe(0);
    expect(result.lastSkipSize).toBe(0);
  });

  it('GET_CATEGORIES_SUCCESS - Should update state with categories', () => {
    let categories = ['action', 'adventure', 'comedy'];

    let result = movieListReducer(state, actions.getCategoriesSuccess(categories));

    expect(result.allCategories).toEqual(categories);
  });

  it('GET_CATEGORIES_FAILURE - Should update state with get categories error',() => {
    let error = 'oh no!';

    let result = movieListReducer(state, actions.getCategoriesFailure(error));

    expect(result.error).toEqual(error);
    expect(result.errorMessage).toEqual('An error occured retrieving Category Selections.');    
  });

  it('ADD_CATEGORY_FILTER - Should update state with selected category', () => {
    let category = 'action';

    let result = movieListReducer(state, actions.addCategoryFilter(category));

    expect(result.selectedCategories).toEqual([category]);
  });

  it('REMOVE_CATEGORY_FILTER - Should update state removing selected category', () => {
    let category = 'action';
    let initialState = new CurrentSearch();
    initialState.selectedCategories = [category];

    let result = movieListReducer(initialState, actions.removeCategoryFilter(category));

    expect(result.selectedCategories).toEqual([]);
  });

  it('SET_SELECTED_MOVIE_ID - Should update state with selected movie id', () => {
    let movieId = 30;

    let result = movieListReducer(state, actions.setSelectedMovieId(movieId));

    expect(result.selectedMovieId).toBe(movieId);
  });

  it('SET_LAST_SCROLL_POSITION - Should update state with last scroll position', () => {
    let lastScrollPosition = 300;

    let result = movieListReducer(state, actions.setLastScrollPosition(lastScrollPosition));

    expect(result.lastScrollPosition).toBe(lastScrollPosition);
  })

});
