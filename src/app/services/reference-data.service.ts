import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable()
export class ReferenceDataService {
  private baseUrl = environment.movieApiUrl + '/api/referenceData';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http){}

  getCategories(): Promise<string[]> {
    return this.http.get(this.baseUrl + '/categories')
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  };

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // todo use toastr + log
    return Promise.reject(error.message || error);
  }

}