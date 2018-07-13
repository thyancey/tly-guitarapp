import React, { Component } from 'react';

import MIDISounds from 'midi-sounds-react';

require('./style.less');

const DEFAULT_INSTRUMENT = 'electricGuitar';

const INSTRUMENTS = {
  nylonGuitar: {
    id: 253
  },
  steelGuitar: {
    id: 260
  },
  electricGuitar: {
    id: 288
  },
  electricBass: {
    id: 378
  },
  banjo: {
    id: 1131
  },
  shamisen: {
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
      curInstrument: INSTRUMENTS[DEFAULT_INSTRUMENT]
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
      case 'SCALE': 
        this.midiSounds.cancelQueue();
        this.playScale(midiNotes);
        break;
      case 'SCALE_FULL': 
        this.midiSounds.cancelQueue();
        this.playFullScale(midiNotes);
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

  setMidiInstrument(newId){
    const foundInstrument = INSTRUMENTS[newId];
    this.midiSounds.cacheInstrument(foundInstrument.id);
    this.setState({curInstrument: foundInstrument})
  }

  componentDidMount() {
    //- TODO, documentation said to do this to init it or something?
    this.midiSounds.cacheInstrument(this.state.curInstrument.id);
    this.setState(this.state);
    this.setVolume(this.props.volume);
  }

  componentDidUpdate(prevProps){
    if(prevProps.midiInstrument !== this.props.midiInstrument){
      this.setMidiInstrument(this.props.midiInstrument)
    }
    if(prevProps.volume !== this.props.volume){
      this.setVolume(this.props.volume);
    }
  }

  onMusicEvent(musicEvent){
    this.playNotes(musicEvent.notes, musicEvent.type);
  }

  setVolume(newVolume){
    this.midiSounds.setMasterVolume(newVolume);
  }

  render() {
    return(
      <div className='musicbox-container'>
        <div className="hidden">
          <MIDISounds ref={(ref) => (this.midiSounds = ref)} appElementName="app"  />
        </div>
      </div>
    );
  }
}
