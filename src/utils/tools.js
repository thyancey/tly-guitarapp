

class Tools{

  static toString(){
    return '(Class Tools)';
  }

  static clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  }

  //- derived from this stack overflow, modified to use pointerEvents instead and have a maxCycles limit
  //- https://stackoverflow.com/questions/8813051/determine-which-element-the-mouse-pointer-is-on-top-of-in-javascript
  static allElementsFromPoint(x, y){
    var element, elements = [];
    var oldPointerEvents = [];
    let maxCycles = 50; //- cause this while loop is scary
    while (true) {
      maxCycles--;
      if(maxCycles === 0){
        console.error('max cycles reached.')
        break;
      }

      element = document.elementFromPoint(x, y);
      if (!element || element === document.documentElement) {
          break;
      }
      if(element.style.pointerEvents === 'none'){
        //- it's hidden! you shouldn't even be here, but if you are, skip it!
        continue;
      }
      elements.push(element);
      oldPointerEvents.push(element.style.pointerEvents);
      element.style.pointerEvents = 'none'; // Temporarily hide the element (without changing the layout)
    }
    for (var k = 0; k < elements.length; k++) {
      elements[k].style.pointerEvents = oldPointerEvents[k];
    }
    elements.reverse();

    return elements;
  }
}

export default Tools;