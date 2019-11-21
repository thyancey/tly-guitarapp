import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class MusicKeyPanel extends Component {
  onMusicKeyClick(musicKey){
    this.props.actions.setMusicKey(musicKey);
    
    if(this.props.playScales){
      global.setTimeout(() => {
        this.props.actions.dispatchEasyMusicEvent({
          type: 'SCALE_FULL'
        });
      }, 0);
    }
  }

  onChordClick(chordLabel){
    if(this.props.chord === chordLabel){
      chordLabel = null;
    }
    this.props.actions.setChord(chordLabel);

    const chordNotes = MusicMan.getChordNotes(chordLabel, this.props.instrument);
    const midiNotes = MusicMan.getMidiScale(chordNotes);
    
    this.props.actions.dispatchMusicEvent({
      type: 'STRUM_DOWN',
      notes: midiNotes
    });
  }

  createNoteButtons(){
    return MusicMan.getNotes().map((note, index) => (
            <StoreButton  actionMethod={(param) => this.onMusicKeyClick(param)} 
                          actionParam={note} 
                          isActive={(note === this.props.musicKey)} 
                          title={note}
                          key={'key-' + index}/>
    ));
  }

  createChordButtons(instrument, musicKey, scale){
    const chordsArray = MusicMan.getChordDefinitions(instrument, musicKey, scale)
    let retArray = []

    retArray = chordsArray.map((chord, index) => (
      <StoreButton  actionMethod={(chord) => this.onChordClick(chord)}
                    actionParam={chord.id}
                    isActive={(chord.id === this.props.chord) && !chord.disabled} 
                    isDisabled={chord.disabled} 
                    title={chord.title}
                    key={'chord-' + index}/>
    ));

    return retArray;
  }

  render() {
    const simpleNotes = MusicMan.getScale(this.props.musicKey, this.props.scale);

    return (
      <div>
        <div className="subpanel">
          {this.createNoteButtons()}
        </div>
        <hr/>
        <div className="subpanel">
          <h2>{'Notes in Key'}</h2>
          <div className="active-notes">
            {simpleNotes.map((note, index) => (
              <span key={'note-' + index}>{note}</span>
            ))}
          </div>
        </div>
        <hr/>
        <div className="subpanel">
          <h2>{'Chords in Key'}</h2>
          <div className="sidebuttons">
            {this.createChordButtons(this.props.instrument, this.props.musicKey, this.props.scale)}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  playScales: state.playMode === 'scale',
  instrument: state.instrument,
  chord: state.chord
}))(MusicKeyPanel);
