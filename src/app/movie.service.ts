import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { MovieResponse } from './movie.response';

@Injectable()
export class MovieService {

  private baseUrl = 'http://localhost:5000';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

  getMovies(): Promise<MovieResponse> {
    return this.http.get(this.baseUrl + '/api/movies')
               .toPromise()
               .then(response => response.json() as MovieResponse)
               .catch(this.handleError);
  };

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // todo use toastr + log
    return Promise.reject(error.message || error);
  }
}