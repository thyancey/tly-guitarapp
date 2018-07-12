import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import ControlPanel from 'src/components/control-panel';
import Fretboard from 'src/components/fretboard';
import ChordPanel from 'src/components/chord-panel';
import SelectionTools from 'src/components/selection-tools';

import MusicBox from 'src/components/musicbox';

require('./style.less');

class Main extends Component {
  constructor(){
    super();
  }

  dispatchMusicEvent(musicEvent){
    this.refs.musicBox.onMusicEvent(musicEvent);
  }

  render() {
    return(
      <div className="main" >
        <MusicBox ref="musicBox" midiInstrument={this.props.midiInstrument} volume={this.props.volume} />
        <ControlPanel dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)}/>
        <Fretboard dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)} />
        <div className="panelgroup-right">
          <SelectionTools />
          <ChordPanel dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)} />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume
}))(Main);
