import { Component, OnInit, HostBinding  }  from '@angular/core';
import { ActivatedRoute, Params }           from '@angular/router';
import { Router }                           from '@angular/router';

import 'rxjs/add/operator/switchMap';

import { Movie }              from '../../models/movie';
import { MovieService }       from '../../services';
import { ScrollerService }    from '../../services';
import { slideLeftAnimation } from '../../animations';


@Component({
  selector: 'movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
  animations: [ slideLeftAnimation ]
})

export class MovieDetailComponent implements OnInit {

  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'absolute';

  constructor(
    private movieService: MovieService,
    private scrollerService: ScrollerService,
    private route: ActivatedRoute,
    private router: Router
  ){}

  movieDetail = new Movie();

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.movieService.getMovie(+params['id']) )
      .subscribe(movie => this.movieDetail = movie);
    
    this.scrollerService.scrollToTop();
  }

  backToList(){
    this.router.navigate(['/home']);
  }
}
