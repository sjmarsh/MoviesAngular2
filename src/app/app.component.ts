import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  template:  `<h1>{{title}}</h1>
              <router-outlet></router-outlet>`,
  styleUrls: ['app.component.css']
})

export class AppComponent {
  title = 'Movie Collection 2';
}