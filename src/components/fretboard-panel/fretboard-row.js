import React, { Component } from 'react';

export default class FretboardRow extends Component {

  getOtherFretStuff(f){
    let retVal = [];
    retVal.push(
      <div className="fret-area" key="fr-fret-area">
      </div>
    );
    if(f === 0){
      retVal.push(<div key={'fr-bg-' + f} className="fret-row-bg nut"/>);
      retVal.push(<div key={'fr-nut'} className="fret-bar-nut"/>);
    }else if(f === 12){
      retVal.push(<div key={'fr-bg-' + f} className="fret-row-bg two-dot"/>);
      retVal.push(<div key={'fr-fret-' + f} className="fret-bar"/>);
    }
    else if([3,5,7,9,15,17,19,21].indexOf(f) > -1){
      retVal.push(<div key={'fr-bg-' + f} className="fret-row-bg one-dot"/>);
      retVal.push(<div key={'fr-fret-' + f} className="fret-bar"/>);
    }else{
      retVal.push(<div key={'fr-bg-' + f} className="fret-row-bg"/>);
      retVal.push(<div key={'fr-fret-' + f} className="fret-bar"/>);
    }
    retVal.push(<div className="fret-index" key={'fret-row-index'}><span>{f}</span></div>);
    return retVal;
  }

  render() {
    const f = this.props.fretIdx;
      // <div className="fret-row" fretIdx={f} >

    return (
      <div className="fret-row" >
        {this.getOtherFretStuff(f)}
      </div>
    );

  }
}
