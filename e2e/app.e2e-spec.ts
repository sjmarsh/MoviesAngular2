import { MoviesAngular2Page } from './app.po';

describe('movies-angular2 App', function() {
  let page: MoviesAngular2Page;

  beforeEach(() => {
    page = new MoviesAngular2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
