import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import StoreButton from 'src/components/shared/store-button';

require('./style.less');

class ChordPanel extends Component {

  onChordClick(chordLabel){
    if(this.props.chord === chordLabel){
      chordLabel = null;
    }
    this.props.actions.setChord(chordLabel);

    const chordNotes = MusicMan.getChordNotes(chordLabel, this.props.instrument);
    const midiNotes = MusicMan.getMidiScale(chordNotes);
    
    this.props.actions.dispatchMusicEvent({
      type: 'STRUM_DOWN',
      notes: midiNotes,
      midiInstrument: 'cheese'
    });
  }
  
  createChordButtons(instrument, musicKey, scale, mode){
    const chordsArray = MusicMan.getChordDefinitions(instrument, musicKey, scale, mode)
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
    return (
      <div className="chord-buttons">
        {this.createChordButtons(this.props.instrument, this.props.musicKey, this.props.scale, this.props.mode)}
      </div>
    );
  }
}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  instrument: state.instrument,
  chord: state.chord,
  mode: state.mode
}))(ChordPanel);
