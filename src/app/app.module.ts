import { BrowserModule }            from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { HttpModule }               from '@angular/http';
import { ReactiveFormsModule }      from '@angular/forms';
import { RouterModule }             from '@angular/router';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { Store, StoreModule }       from '@ngrx/store';
import { EffectsModule }            from '@ngrx/effects';
import { InfiniteScrollModule }     from 'angular2-infinite-scroll';
import { ToasterModule, 
         ToasterService,
         ToasterContainerComponent } from 'angular2-toaster';

import { AppComponent }         from './app.component';
import { MovieListComponent }   from './components/movie-list/movie-list.component';
import { MovieDetailComponent } from './components/movie-detail/movie-detail.component';

import reducer                  from './reducers';
import { MovieService }         from './services';
import { ReferenceDataService } from './services';
import { ScrollerService }      from './services';
import { AppRoutingModule }     from './app.routing.module';
import { MovieListActions }     from './actions';
import { MovieListEffects }     from './effects';

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    ToasterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.provideStore(reducer),
    EffectsModule.run(MovieListEffects)
  ],
  providers: [MovieService, ReferenceDataService, ScrollerService, MovieListActions],
  bootstrap: [AppComponent]
})
export class AppModule { }
