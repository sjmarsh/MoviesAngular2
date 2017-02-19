import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule }  from '@angular/forms';
import { RouterModule }   from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { InfiniteScrollModule } from 'angular2-infinite-scroll';

import { AppComponent } from './app.component';
import { MovieListComponent } from './movie.list.component';
import { MovieDetailComponent } from './movie.detail.component';

import reducer                  from './reducers';
import { MovieService }         from './services/movie.service';
import { AppRoutingModule }     from './app.routing.module';
import { MovieListActions }     from './actions';

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
    ReactiveFormsModule,
    InfiniteScrollModule,
    AppRoutingModule,
    StoreModule.provideStore(reducer)
  ],
  providers: [MovieService, MovieListActions],
  bootstrap: [AppComponent]
})
export class AppModule { }
