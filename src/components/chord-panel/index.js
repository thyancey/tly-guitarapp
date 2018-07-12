import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import StoreButton from 'src/components/shared/store-button';

require('./style.less');

class ChordPanel extends Component {

  onChordClick(chordLabel){
    // console.log('onChordClick(' + chordLabel + ')');
    if(this.props.chord === chordLabel){
      chordLabel = null;
    }
    // console.log('setChord(' + chordLabel + ')');
    this.props.actions.setChord(chordLabel);

    const chordNotes = MusicMan.getChordNotes(chordLabel, this.props.instrument);
    const midiNotes = MusicMan.getMidiScale(chordNotes);
    
    this.props.dispatchMusicEvent({
      type: 'STRUM_DOWN',
      notes: midiNotes
    });
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
    return (
      <div className="chords panel-container">
        <h2>{'Open Chords'}</h2>
        <div className="chord-buttons">
          {this.createChordButtons(this.props.instrument, this.props.musicKey, this.props.scale)}
        </div>
      </div>
    );
  }
}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  instrument: state.instrument,
  chord: state.chord
}))(ChordPanel);
