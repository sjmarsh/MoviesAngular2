import { TestBed, inject, async }                   from '@angular/core/testing';
import { HttpModule, Http, BaseRequestOptions,  
        Response, ResponseOptions, RequestMethod }  from '@angular/http';
import { MockBackend, MockConnection }              from '@angular/http/testing';
import { Observable }                               from 'rxjs/Observable';

import { ReferenceDataService }   from './';
import { environment }            from '../../environments/environment';

fdescribe('ReferenceDataService', ()=>{
  let mockBackend: MockBackend;
  let referenceDataService: ReferenceDataService;

  beforeEach(()=>{
    TestBed.configureTestingModule({
      providers: [
        ReferenceDataService,
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
      referenceDataService = new ReferenceDataService(http);
  }))

  const FakeCategories = ['action', 'adventure', 'comedy'];
  
  describe('getCategories', ()=>{
    it('should return promise of categories', (done) =>{
      mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toEqual(RequestMethod.Get);
          expect(connection.request.url).toEqual(environment.movieApiUrl + '/api/referenceData/categories');
          connection.mockRespond(new Response(new ResponseOptions({
            body: { data: FakeCategories }
          })))
        });

        referenceDataService.getCategories()
          .then(result => {
            expect(result).toEqual({ data: FakeCategories});
            done();
          });
      });

      it('should handle error', (done) => {
        let errorMessage = 'Oh No!';
        mockBackend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new Error(errorMessage));
        });

        referenceDataService.getCategories()
          .catch(error => { 
            expect(error).toBe(errorMessage);
            done();
          });
      });

  });
})