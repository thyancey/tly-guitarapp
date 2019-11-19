import React, { Component } from 'react';
import FretboardIndex from './fretboard-index';

const MAP_CLASSNAMES = {
  '-1': 'fret-bg-nut',
  '0': 'fret-bg-normal',
  '1': 'fret-bg-one-dot',
  '2': 'fret-bg-two-dot'
};

export default class FretboardRow extends Component {
  getOtherFretStuff(f){
    let retVal = [];
    let bgClassname = 'fret-bg';
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

  getDotType(f){
    if(f === 0){
      return -1;
    }else if(f === 12){
      return 2;
    }else if([3,5,7,9,15,17,19,21].indexOf(f) > -1){
      return 1;
    }else{
      return 0;
    }
  }

  getClassName(dotType, prefix){
    switch(dotType){
      case -1: return 'fret-row fret-type-nut';
      case 1: return 'fret-row fret-type-singledot';
      case 2: return 'fret-row fret-type-doubledot';
      default: return 'fret-row fret-type-normal'
    }
  }

  render() {
    const f = this.props.fretIdx;
    const dotType = this.getDotType(f);
    const className = this.getClassName(dotType, 'fret-row');

    if(dotType === 0){
      return (
        <div className={className} />
      );
    }else{
      return (
        <div className={className} >
          <FretboardIndex key="0" label={f} dotLabel={dotType} isTop={true} />
          <div key="1" className="fret-bg" />
          <FretboardIndex key="2" label={f} dotLabel={dotType} />
        </div>
      );
    }
  }
}
