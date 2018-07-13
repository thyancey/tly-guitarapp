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

    // this.props.startDrag({
    //   id: this.props.id,
    //   class: this.props.panelClass,
    //   width: this.reffers.offsetWidth,
    //   height: this.reffers.offsetHeight
    // });
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

  onMouseDown(mE){
    this.startHolding();
  }

  onMouseLeave(mE){
    this.stopHolding();
  }

  onMouseUp(mE){
    this.stopHolding();
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
        <div className="panel-header" onMouseDown={e => this.onMouseDown(e)} >
          <h2>{this.props.title}</h2>
        </div>
        <div className={'panel-body'} >
          {this.props.children}
        </div>
      </div>
    );
  }
}
