export class SearchCriteria {
  
  public searchTerm : string;
  public selectedCategories: Array<string>;
  public currentSkipSize: number;
  public currentTakeSize: number;
  
  public constructor(
    searchTerm = '',
    selectedCategories = new Array<string>(),
    currentSkipSize = 0,
    currentTakeSize = 0
  ){
    this.searchTerm = searchTerm;
    this.selectedCategories = selectedCategories;
    this.currentSkipSize = currentSkipSize;
    this.currentTakeSize = currentTakeSize;
  }
}