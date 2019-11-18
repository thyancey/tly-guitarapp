import React, { Component } from 'react';
import DotLabelSVG from 'images/whitedot.svg';

export default class FretboardIndex extends Component {
  render() {
    if(this.props.isTop){
      return (
        <div className="fret-index" >
          <p className={ 'fret-dotlabel-text'}>{this.props.label}</p>
          <div className={ `fret-dotlabel-graphic` }>
            <div className={ `dotlabel-${this.props.dotLabel}` } />
          </div>
        </div>
      );
    }else{
      return (
        <div className="fret-index" >
          <div className={ `fret-dotlabel-graphic` }>
            <div className={ `dotlabel-${this.props.dotLabel}` } />
          </div>
          <p className={ 'fret-dotlabel-text'}>{this.props.label}</p>
        </div>
      );
    }
  }
}

