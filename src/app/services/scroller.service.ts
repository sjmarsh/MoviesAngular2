export class ScrollerService{

public scrollToTop() : void {
  window.scrollTo(0,0);
};

/**
 * Try and scroll to an element within a containing div once it has loaded using it's last known yPosition
 * @param {string} classNameToWaitFor - the name of the class to wait for before scrolling
 * @param {string} containerElementClassName - the class name for the div containing the scrollable area
 * @param {number} yPositionToScrollTo - the y Position to scroll to
 * @param {number} timeout - how long to wait until the class is loaded in milliseconds
 */
  public tryScrollToPreviousPosition(
    classNameToWaitFor: string, 
    containerElementClassName: string, 
    yPositionToScrollTo: number, 
    timeout: number) : void {
      let start = new Date().getTime();  
      let checkExist = setInterval(function() {
          var element = document.querySelector(classNameToWaitFor);
          if (element != null) {
              var container = document.getElementById(containerElementClassName);
              container.scrollTop = yPositionToScrollTo;
              clearInterval(checkExist);
          }
          else {
            let elapsed = new Date().getTime() - start;
            if(elapsed > timeout){
              clearInterval(checkExist);
            }
          }
        }, 100); // check every 100ms
  };

  /**
   * Scroll to the top of the container
   * @param containerElementClassName 
   */
  public scrollToTopOfContainer(containerElementClassName: string) : void {
    var container = document.getElementById(containerElementClassName);
    container.scrollTop = 0;
  }

  /**
   * Get the current Y axis scroll position for a given container
   * @param containerElementClassName - the class name for the container
   */
  public getScrollPositionInContainer(containerElementClassName: string) : number {
    return document.getElementById(containerElementClassName).scrollTop;
  }
}