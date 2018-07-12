import React, { Component } from 'react';

require('./style.less');

//- from stack overflow 
//- https://stackoverflow.com/questions/8813051/determine-which-element-the-mouse-pointer-is-on-top-of-in-javascript
const allElementsFromPoint = (x, y) => {
  var element, elements = [];
  var old_visibility = [];
  while (true) {
    element = document.elementFromPoint(x, y);
    if (!element || element === document.documentElement) {
        break;
    }
    elements.push(element);
    old_visibility.push(element.style.visibility);
    element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
  }
  for (var k = 0; k < elements.length; k++) {
    elements[k].style.visibility = old_visibility[k];
  }
  elements.reverse();
  return elements;
}

const getPanelPositionOfThis = (panelPositions, panelId) => {
  for(let position in panelPositions){
    const pArr = panelPositions[position];
    for(let i = 0; i < pArr.length; i++){
      if(pArr[i] === panelId){
        return [ position, i ];
      }
    }
  }

  return null;
}



export default class DragCover extends Component {
  constructor(){
    super();

    this.state = {};
  }

  componentDidUpdate(prevProps){
    if(!prevProps.isDragging && this.props.isDragging){
      this.setSpacerOnPanel(this.props.heldPanelId)
    }
  }

  setSpacerOnPanel(id){
    const posObj = getPanelPositionOfThis(this.props.panelPositions, id);

    if(posObj){
      this.props.setSpacerPosition({
        panel: posObj[0],
        index: posObj[1]
      });
    }else{
      this.props.setSpacerPosition(null);
    }
  }

  onMouseMove(e){
    const allElUnder = allElementsFromPoint(e.clientX, e.clientY);
    const underTarget = allElUnder.filter(el => (el.className.indexOf('panel-container') > -1));

    if(underTarget && underTarget.length === 1){
      const cleanId = underTarget[0].dataset.id;

      this.setSpacerOnPanel(cleanId);
    }
  }

  onMouseUp(e){
    this.props.stopDrag(e, this.props.heldPanelId);
  }

  render() {
    const className = this.props.isDragging ? 'dragging' : null;
    return(
      <div  id="drag-cover" className={className} 
            onMouseUp={e => this.onMouseUp(e)}
            onMouseMove={e => this.onMouseMove(e)}>
      </div>
    );
  }
}

