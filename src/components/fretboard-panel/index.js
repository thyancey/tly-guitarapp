import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import FretRow from './fret-row';
import FretColumn from './fret-column';

require('./style.less');

class Fretboard extends Component {
  constructor(){
    super();

    this.state = {
      fretColumns: [],
      fretRows: [],
      counter: 0
    }
  }

  calcFretColumns(octaveNotes){
    var retVal = [];

    let simpleNotes = [];
    for(var n = 0; n < octaveNotes.length; n++){
      simpleNotes.push(octaveNotes[n].split('-')[0]);
    }

    const chordFretIdxs = MusicMan.getChordFretIdxs(this.props.chord, this.props.instrument);

    var instrumentResult = MusicMan.getInstrumentNotesFromLabel(this.props.instrument);
    var strings = instrumentResult.strings;
    var fretBounds = instrumentResult.fretBounds;

    for(var sIdx = 0; sIdx < strings.length; sIdx++){
      retVal.push(
        <FretColumn key={'fc-' + sIdx}
                    scaleNotes={octaveNotes}
                    chordFretIdx={chordFretIdxs[sIdx]}
                    notes={simpleNotes}
                    stringIdx={sIdx}
                    frets={strings[sIdx]}
                    fretBounds={fretBounds[sIdx]}
                    fretChanges={this.props.fretChanges}
                    dispatchMusicEvent={this.props.actions.dispatchMusicEvent} />
      );
    }

    return retVal;
  }

  calcFretRows(octaveNotes){
    let retVal = [];
    let numFrets = MusicMan.getNumFrets();

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
    this.setState({
      fretColumns: this.calcFretColumns(octaveNotes),
      fretRows: this.calcFretRows(octaveNotes),
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
  render() {

    return (
      <div className="fretboard">
        <div className="fret-rows-container" >
          { this.state.fretRows.map(fr => (<FretRow {...fr}/>)) }
        </div>
        <div className="fret-column-container" >
          { this.state.fretColumns.map(fc => (fc)) }
        </div>
        <div className="string-container" >
          { 
            //- one string for each fret row.
            this.state.fretColumns.map((fc,idx) => (
              <div className="string" key={'s-' + idx} />
            ))
          }
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
  fretChanges: state.fretChanges
}))(Fretboard);
