import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  template:  `
              <toaster-container></toaster-container>
              <h1>{{title}}</h1>
              <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css',]
})

export class AppComponent {
  title = 'Movie Collection 2';
}