import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Movie } from '../models/movie';
import { MovieResponse } from '../models/movie.response';
import { CurrentSearch } from '../models/current-search';

import { environment } from '../../environments/environment';

@Injectable()
export class MovieService {

  private baseUrl = environment.movieApiUrl + '/api/movies';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

/*
 // not used
  getMovies(): Promise<MovieResponse> {
    return this.http.get(this.baseUrl)
               .toPromise()
               .then(response => response.json() as MovieResponse)
               .catch(this.handleError);
  };
*/

  searchForMovies(term: string, categories: Array<string>, skip: number, take: number) : Observable<MovieResponse>{    
    var categoryList = '';
    if(categories && categories.length > 0)
    {
      for(let category of categories){
        categoryList += '&categories='+ category;
      }
    } 

    return this.http.get(`${this.baseUrl}?searchFilter=${term}${categoryList}&skip=${skip}&take=${take}`)
                    .map((response) => response.json())
                    .catch(this.handleError);
  }

  getMovie(movieId: number): Promise<Movie> {
    return this.http.get(`${this.baseUrl}/${movieId}`)
               .toPromise()
               .then(response => response.json() as Movie)
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // todo use toastr + log
    return Promise.reject(error.message || error);
  }
}