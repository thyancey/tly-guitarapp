import React, { Component } from 'react';

import MIDISounds from 'midi-sounds-react';

require('./style.less');


const INSTRUMENTS = {
  'steelGuitar': {
    id: 260
  },
  'electricGuitar': {
    id: 288
  },
  'shamisen': {
    id: 1139
  }
}

const SCALE_SPEED = .25;
const SUSTAIN_VALUES = {
  NOTE:1.25,
  SCALE:1,
  CHORD:2.5,
  STRUM_UP:2.5,
  STRUM_DOWN:2.5,
  SNAP:2.5
}

export const PLAY_TYPES = [ 'NOTE', 'SCALE', 'SCALE_FULL', 'CHORD', 'STRUM_UP', 'STRUM_DOWN', 'SNAP' ];

export default class MusicBox extends Component {
  constructor(){
    super();

    this.state = {
      // curInstrument: INSTRUMENTS.steelGuitar
      curInstrument: INSTRUMENTS.shamisen
    };
  }

  getInstruments(){
    const instruments = [];
    for(var key in INSTRUMENTS){
      instruments.push(INSTRUMENTS[key].id);
    }
    return instruments;
  }

  playScale(midiNotes) {
    for(let n = 0; n < midiNotes.length; n++){
      this.midiSounds.playChordAt(this.midiSounds.contextTime() + SCALE_SPEED * n, this.state.curInstrument.id, [midiNotes[n]], SUSTAIN_VALUES.CHORD);
    }
  }

  /* [ 1, 2, 3, 4 ] -> [ 1, 2, 3, 4, 3, 2, 1 ] */
  playFullScale(midiNotes) {
    this.playScale(midiNotes.slice(0).concat(midiNotes.reverse().slice(1)));
  }

  playNotes(midiNotes, type){
    switch(type){
      case 'NOTE': this.midiSounds.playChordNow(this.state.curInstrument.id, midiNotes, SUSTAIN_VALUES.NOTE);
        break;
      case 'SCALE': this.playScale(midiNotes);
        break;
      case 'SCALE_FULL': this.playFullScale(midiNotes);
        break;
      case 'CHORD': this.midiSounds.playChordNow(this.state.curInstrument.id, midiNotes, SUSTAIN_VALUES.CHORD);
        break;
      case 'STRUM_UP': this.midiSounds.playStrumUpNow(this.state.curInstrument.id, midiNotes, SUSTAIN_VALUES.STRUM_UP);
        break;
      case 'STRUM_DOWN': this.midiSounds.playStrumDownNow(this.state.curInstrument.id, midiNotes, SUSTAIN_VALUES.STRUM_DOWN);
        break;
      case 'SNAP': this.midiSounds.playSnapNow(this.state.curInstrument.id, midiNotes, SUSTAIN_VALUES.SNAP);
        break;
    }
  }

  componentDidMount() {
    //- TODO, documentation said to do this to init it or something?
    this.setState(this.state);
  }

  componentDidUpdate(prevProps){
    // if(prevProps.singleNote !== this.props.singleNote){
    //   this.playSingleNote(this.props.singleNote);
    // }
  }

  onMusicEvent(musicEvent){
    this.playNotes(musicEvent.notes, musicEvent.type);
  }

  render() {
    return(
      <div id="musicbox">
        <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="app" instruments={this.getInstruments()} />
      </div>
    );
  }
}
