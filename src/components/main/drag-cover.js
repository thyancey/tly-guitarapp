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

//- just loop through some nested key/object pairs to find a matching panelId
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

  setSpacerOnEmptyPanel(panelGroupId){
    this.props.setSpacerPosition({
      panel: panelGroupId,
      index: 0
    });
  }

  setSpacerOnPanel(targetPanelId, placeBelow){
    const posObj = getPanelPositionOfThis(this.props.panelPositions, targetPanelId);
    const panelOffset = placeBelow ? 1 : 0;

    if(posObj){
      this.props.setSpacerPosition({
        panel: posObj[0],
        index: posObj[1] + panelOffset //- plus one puts it beneath
      });
    }else{
      this.props.setSpacerPosition(null);
    }
  }

  onMouseMove(e){
    const allElUnder = allElementsFromPoint(e.clientX, e.clientY);
    const underTarget = allElUnder.filter(el => (el.className.indexOf('panel-container') > -1));
    // console.log('under', allElUnder)

    if(underTarget && underTarget.length === 1){

      //- figure out if youre on the high or low end of the thing you're hovering
      const box = underTarget[0].getBoundingClientRect();
      let setBottom = false;
      if(e.clientY > (box.bottom - (box.height / 2))){
        setBottom = true;
      }

      const targetPanelId = underTarget[0].dataset.id;

      this.setSpacerOnPanel(targetPanelId, setBottom);
    }else{
      try{
        const underColumn = allElUnder.filter(el => (!!el.dataset.panelgroup));
        const panelGroupId = underColumn[0].dataset.panelgroup;
        if(this.props.panelPositions[panelGroupId].length === 0){
          this.setSpacerOnEmptyPanel(panelGroupId);
        }
      }catch(e){
        console.error('nothing is here!', e)
      }

      // this.setSpacerOnPanel(targetPanelId, setBottom);
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

