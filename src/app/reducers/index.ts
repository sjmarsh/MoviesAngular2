import '@ngrx/core/add/operator/select';
import {compose} from '@ngrx/core/compose';
import {combineReducers} from '@ngrx/store';


import movieListReducer, * as fromMovieList from './movie.list.reducer';

export interface AppState {
    movieList: fromMovieList.MovieListState;
};

export default compose(combineReducers)({
    movieList: movieListReducer
});
