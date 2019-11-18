import React, { Component } from 'react';
import FretboardIndex from './fretboard-index';

export default class FretboardRow extends Component {
  getOtherFretStuff(f){
    let retVal = [];
    let bgClassname = 'fret-bg-alt';
    let dotLabel = '0';

    if(f === 0){
      bgClassname += ' nut';
      dotLabel = '-1';
    }else if(f === 12){
      bgClassname += ' two-dot';
      dotLabel = '2';
    }
    else if([3,5,7,9,15,17,19,21].indexOf(f) > -1){
      bgClassname += ' one-dot';
      dotLabel = '1';
    }

    if(dotLabel !== '0'){
      retVal.push(<FretboardIndex key="0" label={f} dotLabel={dotLabel} isTop={true} />);
      retVal.push(<div className={bgClassname} key="1" />);
      retVal.push(<FretboardIndex key="2" label={f} dotLabel={dotLabel} />);
    }

    return retVal;
  }

  render() {
    const f = this.props.fretIdx;
    return (
      <div className="fret-row" >
        {this.getOtherFretStuff(f)}
      </div>
    );

  }
}
