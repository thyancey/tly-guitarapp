import React, { Component } from 'react';
import { connect } from 'src/store';

import Tools from 'src/utils/tools';

require('./style.less');


/*
 just loop through some nested key/object pairs to find a matching panelId

 //- ex
 panelPositions: {
    left:[
      'scales',
      'chords',
      'keys'
    ]
  }
*/
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


class DragCover extends Component {
  constructor(){
    super();

    this.state = {};
  }

  componentDidUpdate(prevProps){
    if(!prevProps.isDragging && this.props.isDragging){
      this.setSpacerOnPanel(this.props.heldPanelId)
    }

    if(this.props.dragX !== prevProps.dragX || this.props.dragY !== prevProps.dragY){
      this.emulateDragging(this.props.dragX, this.props.dragY);
    }

    global.goober = this.refs.ello
  }

  /* 
    this emulateDragging is because touchmove and touchend must listen to the element they started on.. 
    which is a panel, somewhere else. To get touchmove to work on the drag container, 
    must communicate touch positions through the store.
  */
  emulateDragging(x,y){
    if(x === -1 && y === -1){
      this.props.actions.dropPanel(this.props.heldPanelId);
    }else{
      this.identifyWhatsUnderThisPosition(x,y);
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


  identifyWhatsUnderThisPosition(x, y){
    const allElUnder = Tools.allElementsFromPoint(x, y);
    const underTarget = allElUnder.filter(el => (el.className.indexOf('panel-container') > -1));

    if(underTarget && underTarget.length === 1){

      //- figure out if youre on the high or low end of the thing you're hovering
      const box = underTarget[0].getBoundingClientRect();
      let setBottom = false;
      if(y > (box.bottom - (box.height / 2))){
        setBottom = true;
      }

      const targetPanelId = underTarget[0].dataset.id;

      this.setSpacerOnPanel(targetPanelId, setBottom);
    }else{
      try{
        const underColumn = allElUnder.filter(el => (!!el.dataset.panelgroup));

        if(underColumn && underColumn.length === 1){
          const panelGroupId = underColumn[0].dataset.panelgroup;
          if(this.props.panelPositions[panelGroupId].length === 0){
            this.setSpacerOnEmptyPanel(panelGroupId);
          }
        } else{
          //- user is probably dragging outside of the window.
        }
      }catch(err){
        console.error('Unexpeced error when looking for panel under drag position', err);
      }
    }
  }

  onMouseMove(e){
    this.identifyWhatsUnderThisPosition(e.clientX, e.clientY);
  }

  onMouseUp(e){
    this.props.actions.dropPanel(this.props.heldPanelId);
  }

  render() {
    const className = this.props.isDragging ? 'dragging' : null;
    return(
      <div  id="drag-cover" className={className} ref={'ello'}
            onMouseUp={e => this.onMouseUp(e)}
            onMouseMove={e => this.onMouseMove(e)}>
      </div>
    );
  }
}


export default connect(state => ({
  dragX: state.dragX,
  dragY: state.dragY,
  isDragging: state.isDragging
}))(DragCover);