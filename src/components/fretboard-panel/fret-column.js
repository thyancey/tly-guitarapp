import React, { Component } from 'react';
import { connect } from 'src/store';

import { PLAY_TYPES } from 'src/components/musicbox';

import MusicMan from 'src/utils/musicman';

import Fret from'./fret';

class FretColumn extends Component {
  constructor(){
    super();

    this.state = {
      savedFrets: []
    }
  }

  selectNote(octaveNote, fIdx){
    let note = octaveNote.split('-')[0];
    let octave = octaveNote.split('-')[1];

    if(this.props.selectionMode.noteClick){
      this.props.actions.setMusicKey(note);
      this.props.actions.setOctave(octave);
    }

    if(this.props.selectionMode.scaleMode){
      this.triggerSound('SCALE_FULL', octaveNote);
    }else{
      this.triggerSound('NOTE', octaveNote);
    }
  }

  triggerSound(type, octaveNote){
    if(PLAY_TYPES.indexOf(type) === -1){
      console.error(`given type "${type}" is not a valid note trigger type. Available types: ${PLAY_TYPES}`);
      return null;
    }else{
      if(type === 'NOTE'){
        const midiNote = MusicMan.getMidiNote(octaveNote);
        this.props.dispatchMusicEvent({
          type: type,
          notes: [midiNote]
        });
      }else{
        const octaveNotes = MusicMan.getScale(octaveNote, this.props.scale);
        const midiNotes = MusicMan.getMidiScale(octaveNotes);
        this.props.dispatchMusicEvent({
          type: type,
          notes: midiNotes
        });
      }
    }

  }

  calcSpacer(stringIdx, fretIdx){
    //- get the spacer
    let className = 'fret-spacer';
    if(fretIdx === 0){
      className += ' fret-spacer-nut';
    }else{
      className += ' fret-spacer-fret';
    }

    return {
      type: 'spacer',
      key: 's-' + stringIdx + '-fs-' + fretIdx,
      className: className
    }
  }

  calcBlankFret(stringIdx, fretIdx){
    return {
      type: 'blank',
      key: 'fs-' + fretIdx,
      className: 'fret'
    }
  }

  calcFret(stringIdx, fretIdx, fretData, scaleNotes){
    const octaveNote = fretData.octaveNote;
    const note = octaveNote.split('-')[0];
    const octave = octaveNote.split('-')[1];

    const scalePosition = scaleNotes.indexOf(octaveNote);
    const noteIdx = this.props.notes.indexOf(note);

    const isChordFret = this.props.chord && fretIdx === this.props.chordFretIdx;

    return ({
      type: 'fret',
      key: 's-' + stringIdx + '-f-' + fretIdx,
      fretIdx: fretIdx,
      scalePosition: scalePosition,
      noteIdx: noteIdx,
      isChordFret: isChordFret,
      chord: this.props.chord,
      octaveNote: octaveNote,
      note: note,
      octave: octave,
      selectNote:  (octaveNote, fIdx) => this.selectNote(octaveNote, fIdx)
    });
  }

  //- fret bounds have a start stop, ex, [5,10] means there are only 11 frets, from 5 to 10. The first 5 and remaining frets should be filled empty
  //- frets are real notes which should sit within the fret bounds
  //- chordFretIdx is the index of a fret that should be the only one showing
  calcFretsInColumn(s, frets, fretBounds, scaleNotes){
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

    //- TODO, instruments with shorter bridges for certain strings would have some fretBounds[1] logic here.

    for(let f = 0; f < finalFrets.length; f++){
      if(finalFrets[f].type === 'empty'){
        retVal.push(this.calcBlankFret(s, f));
        retVal.push(this.calcSpacer(s, f));
      }else if(finalFrets[f].type === 'fret'){
        retVal.push(this.calcFret(s, f, finalFrets[f], scaleNotes));
        retVal.push(this.calcSpacer(s, f));
      }
    }

    return retVal;
  }

  //- TODO: I've tried to optimize the render/recalculation workflow a bit, but it's really the parent's (fret container) job to 
  //- tell this guy when to recalculate. It is, but it's all kinda janky and isn't easy to follow. needs a refactor.
  recalcFrets(){
    this.setState({'savedFrets':this.calcFretsInColumn(this.props.stringIdx, this.props.frets, this.props.fretBounds, this.props.scaleNotes)});
  }

  componentDidMount() {
    this.recalcFrets();
  }

  componentDidUpdate(prevProps){
    if(prevProps.fretChanges !== this.props.fretChanges){
      this.recalcFrets();
    }
  }


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
      <div className="fret-column" >
        {this.renderFrets(this.state.savedFrets)}
      </div>
    );
  }
}

export default connect(state => ({ 
  chord: state.chord,
  selectionMode: state.selectionMode,
  scale: state.scale,
  octave: state.octave
}))(FretColumn);