import { Component, OnInit  }    from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Router }               from '@angular/router';
import { Location }                 from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { Movie } from './movie';
import { MovieService } from './movie.service';

@Component({
  selector: 'movie-detail',
  templateUrl: './movie.detail.component.html',
  styleUrls: [
    './app.component.css']
})

export class MovieDetailComponent implements OnInit {

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ){}

  movieDetail = new Movie();

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.movieService.getMovie(+params['id']))
      .subscribe(movie => this.movieDetail = movie);
  }

  backToList(){
    this.router.navigate(['/home']);
  }
}
