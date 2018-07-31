import React, { Component } from 'react';

require('./style.less');

export default class Panel extends Component {
  constructor(){
    super();

    this.state = {
      holding: false
    };
  }

  startDragEvent(){
    this.setState({ holding: false });

    this.props.startDrag(this.props.id);
  }

  startHoldTimer(){
    this.holdTimer = global.setTimeout(() => {
      this.startDragEvent();
    }, 200);
  }

  killHoldTimer(){
    if(this.holdTimer){
      global.clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
  }

  startHolding(){
    this.killHoldTimer();
    this.startHoldTimer();
    this.setState({ holding: true });
  }

  stopHolding(){
    if(this.state.holding){
      this.killHoldTimer();
      this.setState({ holding: false });
    }
  }

  onDragStart(touchOrMouseEvent){
    this.startHolding();
  }

  onMouseDown(mouseEvent){
    this.startHolding();
  }

  onMouseLeave(mouseEvent){
    this.stopHolding();
  }

  onMouseUp(mouseEvent){
    this.stopHolding();
  }

  //- touchmove and end must be communicated here through the store to the dragpanel
  //- because touchevents are only heard on the element that received the touchstart
  onTouchMove(touchEvent){
    try{
      let eventX = touchEvent.changedTouches[0].clientX;
      let eventY = touchEvent.changedTouches[0].clientY;
      this.props.setDraggingPosition(eventX, eventY, true);
    }catch(err){
      console.error('problem with onTouchMove:', err);
    }
  }

  onTouchEnd(touchEvent){
    // console.log('onTouchEnd')
    try{
      touchEvent.preventDefault();
      this.props.setDraggingPosition(-1, -1);
    }catch(err){
      console.error('problem with onMouseOrTouchEnd:', err);
    }
  }

  render() {
    let className = `panel-container panel-${this.props.panelClass}`;

    if(this.state.holding){
      className += ' holding';
    }
    if(this.props.isBeingDragged){
      className += ' dragging';
    }

    return (
      <div  className={className} 
            ref={(ref) => (this.reffers = ref)} 
            onMouseLeave={e => this.onMouseLeave(e)}
            onMouseUp={e => this.onMouseUp(e)} 
            data-id={this.props.id}>
        <div  className="panel-header" 
              onMouseDown={e => this.onDragStart(e)} 
              onTouchStart={e => this.onDragStart(e)} 
              onTouchMove={e => this.onTouchMove(e)}
              onTouchEnd={e => this.onTouchEnd(e)} >
          <h2>{'~ ' + this.props.title + ' ~'}</h2>
        </div>
        <div className={'panel-body'} >
          {this.props.children}
        </div>
      </div>
    );
  }
}
