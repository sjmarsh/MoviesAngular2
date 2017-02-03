import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';
import { MovieResponse } from './movie.response';

@Injectable()
export class MovieService {

  private baseUrl = 'http://localhost:5000' + '/api/movies';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

  getMovies(): Promise<MovieResponse> {
    return this.http.get(this.baseUrl)
               .toPromise()
               .then(response => response.json() as MovieResponse)
               .catch(this.handleError);
  };

  searchForMovies(term: string) : Observable<MovieResponse>{    
    return this.http.get(`${this.baseUrl}?searchFilter=${term}`)
                    .map((response) => response.json())
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // todo use toastr + log
    return Promise.reject(error.message || error);
  }
}