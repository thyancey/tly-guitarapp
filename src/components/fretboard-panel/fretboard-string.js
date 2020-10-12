import React, { Component } from 'react';

import Fret from'./fret';

export default class FretboardString extends Component {

  //- this could be done way better, but some BS was happening with Lists
  //- its complicated cause of instruments like banjos where the first few frets are missing
  //- but still, should be simple with maps and filters
  renderFrets(frets, fretBounds){
    const retVal = [];
    if(!frets || frets.size === 0){
      return null;
    }

    let firstFretIdx = frets.get(0).fretIdx;
    let numBlank = firstFretIdx - 1;
    if(numBlank > 0){
      for(let i = 0; i <= numBlank; i++){
        retVal.push(<div className="fret-blank" key={i} />);
      }
    }

    for(let f = 0; f < frets.size; f++){
      const fret = frets.get(f);
      retVal.push(
        <Fret 
          key={'f-' + f} 
          simpleNote={fret.simpleNote}
          octave={fret.octave}
          octaveNote={fret.octaveNote}
          isInChord={fret.isInChord}
          isInFound={fret.isInFound}
          isInPattern={fret.isInPattern}
          isMidiNote={fret.isMidiNote}
          noteIdx={fret.noteIdx}
          fretData={fret} />
      );
    }

    const remainingBlankFrets = fretBounds[1] - retVal.length;
    if(remainingBlankFrets > 0){
      for(let i = 0; i <= remainingBlankFrets; i++){
        retVal.push(<div className="fret-blank" key={i} />);
      }
    }
    
    return retVal;
  }

  render() {
    return (
      <div className="fretboard-string" style={{ height: this.props.stringHeight }}>
        { this.renderFrets(this.props.frets, this.props.fretBounds) }
      </div>
    );
  }
}

