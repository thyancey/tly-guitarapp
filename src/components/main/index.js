import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import Fretboard from 'src/components/fretboard-panel';
import MusicBox from 'src/components/musicbox';

import ChordPanel from 'src/components/panels/chord-panel';
import InstrumentPanel from 'src/components/panels/instrument-panel';
import MusicKeyPanel from 'src/components/panels/musickey-panel';
import NoteDisplayPanel from 'src/components/panels/notedisplay-panel';
import ScalePanel from 'src/components/panels/scale-panel';
import ToolsPanel from 'src/components/panels/tools-panel';

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

        <div className="panelgroup-left">
          <MusicKeyPanel />
          <ScalePanel dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)}/>
        </div>
        <div className="panelgroup-center">
          <NoteDisplayPanel />
          <Fretboard dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)} />
        </div>
        <div className="panelgroup-right">
          <ChordPanel dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)} />
          <InstrumentPanel />
          <ToolsPanel />
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume
}))(Main);
