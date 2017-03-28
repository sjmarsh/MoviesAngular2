/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent }   from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterOutlet } from "@angular/router";
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { ToasterModule, 
         ToasterService,
         ToasterContainerComponent } from 'angular2-toaster';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [
        {provide: Router,  useClass: RouterStub }
      ],
      imports: [ RouterTestingModule, BrowserAnimationsModule, ToasterModule ]
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Movie Collection 2'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Movie Collection 2');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Movie Collection 2');
  }));
});

class RouterStub {
  navigateByUrl(url: string) { return url; }
}
