import React, { Component } from 'react';

import Fret from'./fret';

export default class FretboardString extends Component {

  renderFrets(frets){
    const retVal = [];
    frets.forEach((f, idx) => {
      switch(f.type){
        case 'fret': retVal.push(<Fret {...f}/>);
          break;
        default: retVal.push(<div {...f}/>);
      }
    });

    return retVal;
  }

  render() {
    return (
      <div className="fretboard-string" >
        {this.renderFrets(this.props.frets)}
      </div>
    );
  }
}

