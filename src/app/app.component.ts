import { Component, OnInit }    from '@angular/core';
import { FormControl }          from '@angular/forms';
import { Observable }           from 'rxjs/Observable';
import { Subject }              from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchmap';

import { Movie } from './movie';
import { MovieResponse } from './movie.response';
import { MovieService } from './movie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css']
})

export class AppComponent implements OnInit {
 
  title = 'Movie Collection';
  term = new FormControl();
  searchResult = new MovieResponse();
  hasResults: boolean;
  
  constructor(private movieService: MovieService){
  };

  ngOnInit(): void {

    this.term.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this.movieService.searchForMovies(term))
            .subscribe(result => this.updateSearchResult(result));

    this.term.setValue(''); // trigger initial search
  }

  private updateSearchResult(searchResult: MovieResponse){
    this.searchResult = searchResult;
    this.hasResults = this.searchResult.movies.length > 0; 
  }

}
