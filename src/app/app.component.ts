import { Component } from '@angular/core';

import { Movie } from './movie';
import { MovieResponse } from './movie.response';
import { MovieService } from './movie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(
    private movieService: MovieService,
  ){}

  title = 'Movie Collection';
  movieList = [];

  ngOnInit(): void {
    this.getMovies();
  };

  getMovies(): void {
    this.movieService.getMovies().then(movieResponse => { 
      console.log(movieResponse);
      this.movieList = movieResponse.movies; 
    });
  }; 
}
