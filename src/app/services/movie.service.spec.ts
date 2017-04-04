import { TestBed, inject, async }                   from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions,  
        Response, ResponseOptions, RequestMethod }  from '@angular/http';
import { MockBackend, MockConnection }              from '@angular/http/testing';
import { Observable }                               from 'rxjs/Observable';

import { MovieService }   from './';
import { environment }    from '../../environments/environment';
import { SearchCriteria } from '../models';

describe('MovieService', ()=>{
  let mockBackend: MockBackend;
  let movieService: MovieService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers: [
        MovieService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options),
          deps: [ MockBackend, BaseRequestOptions ]
        }
      ]
    });
  });

  beforeEach(inject([MockBackend, Http], 
    (mb: MockBackend, http: Http) => {
      mockBackend = mb;
      movieService = new MovieService(http);
  }));

  describe('searchForMoviesWithCriteria', ()=>{
    let searchCriteria = new SearchCriteria('super', ['action'], 10, 20);
    let fakeMovieResponse = { movies: ['super'], count: 1 };

    it('should call service with search criteria', () =>{
      let expectedUrl = `${environment.movieApiUrl}/api/movies?searchFilter=${searchCriteria.searchTerm}&categories=${searchCriteria.selectedCategories[0]}&skip=${searchCriteria.currentSkipSize}&take=${searchCriteria.currentTakeSize}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedUrl);
        connection.mockRespond(new Response(new ResponseOptions({
            body: { data: fakeMovieResponse }
          })))
      });

      movieService.searchForMoviesWithCriteria(searchCriteria);
    });

    it('should return Observable of MovieResponse', (done) =>{
      
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
            body: { data: fakeMovieResponse }
          })))
      });

      movieService.searchForMoviesWithCriteria(searchCriteria)
        .subscribe(response => {
          expect(response).toEqual({ data: fakeMovieResponse });
          done();
        });
    });

    it('should handle error', async(()=>{
      let errorMessage = 'Oh No!';
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error(errorMessage));
      });

      var result = movieService.searchForMoviesWithCriteria(searchCriteria)
        .catch(err => { 
          expect(err).toEqual(errorMessage);
          return err;
        })
        .subscribe(result => {/* need to subscribe to force method call*/ });      
      }));

  });

  describe('getMovie', ()=> {
    const movieId = 30;
    const movie = {title: 'superman'};

    it('should get movie from api with given id', () => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(environment.movieApiUrl + '/api/movies/' + movieId);
        connection.mockRespond(new Response(new ResponseOptions({
            body: { data: movie }
          })))
      });

      movieService.getMovie(movieId);
    });

    it('should return promise for requested movie', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
            body: { data: movie }
          })))
      });

      movieService.getMovie(movieId)
        .then(result => {
          expect(result).toEqual({data: movie});
          done();
        });
    });

    it('should handle error', (done) => {
      let errorMessage = 'Oh No!';
      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error(errorMessage));
      });

      movieService.getMovie(movieId)
        .catch(error => {
          expect(error).toEqual(errorMessage);
          done();
        });
    });

  });

});