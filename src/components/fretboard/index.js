import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import FretRow from './fret-row';
import FretColumn from './fret-column';

require('./style.less');

class Fretboard extends Component {
  getFretRows(octaveNotes){
    let retVal = [];
    let numFrets = MusicMan.getNumFrets();

    let simpleNotes = [];
    for(let n = 0; n < octaveNotes.length; n++){
      simpleNotes.push(octaveNotes[n].split('-')[0]);
    }
    for(let fIdx = 0; fIdx < numFrets; fIdx++){
      retVal.push(
        <FretRow notes={simpleNotes} fretIdx={fIdx} key={'fr-' + fIdx} />
      );
    }
    return retVal;
  }

  getFretColumns(octaveNotes){
    var retVal = [];

    let simpleNotes = [];
    for(var n = 0; n < octaveNotes.length; n++){
      simpleNotes.push(octaveNotes[n].split('-')[0]);
    }

    const chordFretIdxs = MusicMan.getChordFretIdxs(this.props.chord, this.props.instrument);

    var instrumentResult = MusicMan.getInstrumentNotesFromLabel(this.props.instrument);
      // console.log("HEY instrumentResult", instrumentResult);
    var strings = instrumentResult.strings;
    var fretBounds = instrumentResult.fretBounds;
    // var nuts = instrumentResult.nuts;

    for(var sIdx = 0; sIdx < strings.length; sIdx++){


      retVal.push(
        <FretColumn key={'fc-' + sIdx} 
                    scaleNotes={octaveNotes}
                    chordFretIdx={chordFretIdxs[sIdx]}
                    notes={simpleNotes} 
                    stringIdx={sIdx} 
                    frets={strings[sIdx]} 
                    fretBounds={fretBounds[sIdx]} 
                    dispatchMusicEvent={this.props.dispatchMusicEvent} />
      );
    }
    return retVal;
  }
  
  render() {
    // const octaveNotes = [1];
    const octaveNotes = MusicMan.getScale(this.props.musicKey, this.props.scale, this.props.octave);
    return (
      <div className="fretboard-container">
        <div className="fretboard">
          <div className="fret-rows-container" >
            {this.getFretRows(octaveNotes)}
          </div>
          <div className="fret-column-container" >
            {this.getFretColumns(octaveNotes)}
          </div>
          <div className="string-container" >
            <div className="string" key="s-1"/>
            <div className="string" key="s-2"/>
            <div className="string" key="s-3"/>
            <div className="string" key="s-4"/>
            <div className="string" key="s-5"/>
            <div className="string" key="s-6"/>
          </div>
        </div>
      </div>
    );
  }
}


//- pass this component through the connect method to attach store values to props.
//- actions get mapped to props without explicitly stating anything. you can use any action from the store.
export default connect(state => ({ 
  musicKey: state.musicKey,
  octave: state.octave,
  scale: state.scale,
  chord: state.chord,
  instrument: state.instrument
}))(Fretboard);
