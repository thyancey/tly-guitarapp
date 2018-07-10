import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';

import Fret from'./fret';

class FretColumn extends Component {

  selectNote(octaveNote, midiNote, fIdx){
    console.log('selectNote: ' + midiNote + ', ' + octaveNote);

    if(this.props.selectionMode.noteClick){
      this.props.actions.setMusicKey(octaveNote.split('-')[0]);
      this.props.actions.setOctave(octaveNote.split('-')[1]);
    }

/*
    if(this.props.selectionMode.shapeScale){
      const exactScale = global.musicMan.getShapedScale(octaveNote, this.props.scale, fIdx);
      this.props.setShapeScale(exactScale);
    }*/

    //const scaleNotes = global.musicMan.getExactScale(octaveNote, this.props.scale);
    // global.musicMan.playMidiScale(scaleNotes);
    // MusicMan.playMidiNote(octaveNote);
  }

  renderSpacer(stringIdx, fretIdx){
    //- get the spacer
    let className = 'fret-spacer';
    if(fretIdx === 0){
      className += ' fret-spacer-nut';
    }else{
      className += ' fret-spacer-fret';
    }

    return (
      <div key={'s-' + stringIdx + '-fs-' + fretIdx} className={className}/>
    )
  }

  renderBlankFret(stringIdx, fretIdx){
    return (
      <div key={'fs-' + fretIdx} className="fret" >
      </div>
    );
  }

  renderFret(stringIdx, fretIdx, fretData, scaleNotes){
    const octaveNote = fretData.octaveNote;
    // console.log('fretData', fretData);
    const note = octaveNote.split('-')[0];
    const octave = octaveNote.split('-')[1];
    const midiNote = MusicMan.getNoteChange('C-2', octaveNote) + 50;
    const scalePosition = scaleNotes.indexOf(octaveNote);
    const noteIdx = this.props.notes.indexOf(note);

    const isChordFret = this.props.chord && fretIdx === this.props.chordFretIdx;

    // console.log(stringIdx + ' isChordFret');
    // console.log(this.props.chord + ' && ' + fretIdx + ' === ' + this.props.chordFretIdx);
    // console.log(isChordFret);

    return (
      <Fret key={'s-' + stringIdx + '-f-' + fretIdx} 
            fretIdx={fretIdx} 
            scalePosition={scalePosition} 
            noteIdx={noteIdx}
            isChordFret={isChordFret}
            chord={this.props.chord}
            octaveNote={octaveNote} 
            note={note} 
            octave={octave} 
            midiNote={midiNote} 
            selectNote={(octaveNote, midiNote, fIdx) => this.selectNote(octaveNote, midiNote, fIdx)}/>
    );
  }

  //- fret bounds have a start stop, ex, [5,10] means there are only 11 frets, from 5 to 10. The first 5 and remaining frets should be filled empty
  //- frets are real notes which should sit within the fret bounds
  //- chordFretIdx is the index of a fret that should be the only one showing
  getFretsInColumn(s, frets, fretBounds, scaleNotes, shapeScale){
    let retVal = [];

    const finalFrets = [];
    const totalFrets = fretBounds[0] + frets.length;

    //- all spacers except the target fret
    for(let f = 0; f < fretBounds[0]; f++){
      finalFrets.push({
        'type':'empty',
        'origIdx':f
      });
    }
    for(let f = 0; f < frets.length; f++){
      finalFrets.push({
        'type':'fret',
        'origIdx':f,
        'octaveNote':frets[f]
      });
    }

    // console.log('finalFrets', finalFrets);

    //- TODO, instruments with shorter bridges for certain strings would have some fretBounds[1] logic here.

    for(let f = 0; f < finalFrets.length; f++){
      if(finalFrets[f].type === 'empty'){
        retVal.push(this.renderBlankFret(s, f));
        retVal.push(this.renderSpacer(s, f));
      }else if(finalFrets[f].type === 'fret'){
        retVal.push(this.renderFret(s, f, finalFrets[f], scaleNotes));
        retVal.push(this.renderSpacer(s, f));
      }
    }

    return retVal;
  }

  render() {
    const s = this.props.stringIdx;

      // <div className="fret-column" stringIdx={s} >
    return (
      <div className="fret-column" >
        {this.getFretsInColumn(s, this.props.frets, this.props.fretBounds, this.props.scaleNotes, this.props.shapeScale)}
      </div>
    );
  }
}

export default connect(state => ({ 
  chord: state.chord,
  selectionMode: state.selectionMode,
  shapeScale: state.shapeScale,
  scale: state.scale,
  octave: state.octave
}))(FretColumn);
