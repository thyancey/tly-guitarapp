import React, { Component } from 'react';
import FretboardIndex from './fretboard-index';

export default class FretboardRow extends Component {
  getOtherFretStuff(f, isAlternate){
    let retVal = [];

    if(isAlternate){

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
    }else{
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
  }

  render() {
    const f = this.props.fretIdx;

    return (
      <div className="fret-row" >
        {this.getOtherFretStuff(f, this.props.isAlternate)}
      </div>
    );

  }
}
