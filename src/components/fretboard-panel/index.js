import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import FretboardRow from './fretboard-row';
import FretboardString from './fretboard-string';
import FreboardStringController from './fretboard-string-controller';

require('./style.less');
require('./alternate.less');


class Fretboard extends Component {
  constructor(){
    super();

    this.state = {
      fretboardStrings: [],
      fretboardRows: [],
      counter: 0
    }
  }

  calcFretboardStrings(octaveNotes, maxFrets){
    var retVal = [];

    let simpleNotes = [];
    for(var n = 0; n < octaveNotes.length; n++){
      simpleNotes.push(octaveNotes[n].split('-')[0]);
    }

    const chordFretIdxs = MusicMan.getChordFretIdxs(this.props.chord, this.props.instrument);

    var instrumentResult = MusicMan.getInstrumentNotesFromLabel(this.props.instrument);
    var strings = instrumentResult.strings;
    var fretBounds = instrumentResult.fretBounds;

    for(var sIdx =  strings.length - 1; sIdx >= 0; sIdx--){
      retVal.push(
        <FreboardStringController key={'fc-' + sIdx}
                    scaleNotes={octaveNotes}
                    chordFretIdx={chordFretIdxs[sIdx]}
                    notes={simpleNotes}
                    stringIdx={sIdx}
                    stringHeight={(100 / strings.length) - 1 + '%'}
                    frets={strings[sIdx]}
                    isAlternate={true}
                    fretBounds={fretBounds[sIdx]}
                    fretChanges={this.props.fretChanges}
                    dispatchMusicEvent={this.props.actions.dispatchMusicEvent} />
      );
    }

    return retVal;
  }

  calcFretboardRows(octaveNotes, numFrets){
    let retVal = [];
    
    let simpleNotes = [];
    for(let n = 0; n < octaveNotes.length; n++){
      simpleNotes.push(octaveNotes[n].split('-')[0]);
    }
    for(let fIdx = 0; fIdx < numFrets; fIdx++){
      retVal.push({
        key:'fr-' + fIdx,
        notes:simpleNotes,
        fretIdx:fIdx
      });
    }

    return retVal;
  }


  componentDidMount() {
    this.recalcFrets();
  }

  recalcFrets(){
    const octaveNotes = MusicMan.getScale(this.props.musicKey, this.props.scale, this.props.octave);
    const maxFrets = MusicMan.getInstrumentNumFrets(this.props.instrument);
    this.setState({
      fretboardStrings: this.calcFretboardStrings(octaveNotes, maxFrets),
      fretboardRows: this.calcFretboardRows(octaveNotes, maxFrets),
      counter: this.state.counter++
    });
  }

  componentDidUpdate(prevProps){
    if(prevProps.fretChanges !== this.props.fretChanges || prevProps.musicKey !== this.props.musicKey){
      this.recalcFrets();
    }
  }

  //- I don't usually like spreads, but it makes sense here. Only calculate fret stuff when you have to.
  //- save pretty much everything you want to give to the components in state, then just pass it in on render.

  //- remember to reverse the order of the strings, cause im a dummy and defined them bottom to top
  render() {
    return (
      <div className="fretboard fretboard-alternate">
        <div className="fret-rows-container" >
          {/* { this.props.fretMatrix.map((stringObj, i) => (<FretboardRow key={i} isAlternate={true} {...stringObj} />)) } */}
          { this.state.fretboardRows.map(fr => (<FretboardRow isAlternate={true} {...fr}/>)) }
        </div>
        <div className="fretboard-strings-container" >
          { this.props.fretMatrix.reverse().map((stringObj, i) => (
            <FretboardString 
              key={i} 
              frets={stringObj.frets}
              stringHeight={(100 / this.props.fretMatrix.size) - 1 + '%'}
              isAlternate={true} />
          )) }
          {/* { this.state.fretboardStrings.map(fc => (fc)) } */}
        </div>
      </div>
    );
  }
}


export default connect(state => ({ 
  musicKey: state.musicKey,
  keyFinderNotes: state.keyFinderNotes,
  octave: state.octave,
  scale: state.scale,
  chord: state.chord,
  instrument: state.instrument,
  fretChanges: state.fretChanges,
  fretMatrix: state.fretMatrix
}))(Fretboard);
