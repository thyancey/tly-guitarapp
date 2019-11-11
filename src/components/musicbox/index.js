import React, { Component } from 'react';

import MIDISounds from 'midi-sounds-react';
import MIDI_INSTRUMENT_DATA from 'src/data/mididata.js';

require('./style.less');

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
      curInstrument: this.findInstrument()
    };
  }

  getInstruments(){
    const instruments = [];
    for(var key in MIDI_INSTRUMENT_DATA.instruments){
      instruments.push(MIDI_INSTRUMENT_DATA.instruments[key].midiId);
    }
    return instruments;
  }

  playScale(midiNotes) {
    for(let n = 0; n < midiNotes.length; n++){
      this.midiSounds.playChordAt(this.midiSounds.contextTime() + SCALE_SPEED * n, this.state.curInstrument.midiId, [midiNotes[n]], SUSTAIN_VALUES.CHORD);
    }
  }

  /* [ 1, 2, 3, 4 ] -> [ 1, 2, 3, 4, 3, 2, 1 ] */
  playFullScale(midiNotes) {
    this.playScale(midiNotes.slice(0).concat(midiNotes.reverse().slice(1)));
  }

  playNotes(midiNotes, type){
    switch(type){
      case 'NOTE': this.midiSounds.playChordNow(this.state.curInstrument.midiId, midiNotes, SUSTAIN_VALUES.NOTE);
        break;
      case 'SCALE': 
        this.midiSounds.cancelQueue();
        this.playScale(midiNotes);
        break;
      case 'SCALE_FULL': 
        this.midiSounds.cancelQueue();
        this.playFullScale(midiNotes);
        break;
      case 'CHORD': this.midiSounds.playChordNow(this.state.curInstrument.midiId, midiNotes, SUSTAIN_VALUES.CHORD);
        break;
      case 'STRUM_UP': this.midiSounds.playStrumUpNow(this.state.curInstrument.midiId, midiNotes, SUSTAIN_VALUES.STRUM_UP);
        break;
      case 'STRUM_DOWN': this.midiSounds.playStrumDownNow(this.state.curInstrument.midiId, midiNotes, SUSTAIN_VALUES.STRUM_DOWN);
        break;
      case 'SNAP': this.midiSounds.playSnapNow(this.state.curInstrument.midiId, midiNotes, SUSTAIN_VALUES.SNAP);
        break;
    }
  }

  findInstrument(instrumentId){
    if(!instrumentId){
      instrumentId = MIDI_INSTRUMENT_DATA.defaultInstrument;
    }
    return MIDI_INSTRUMENT_DATA.instruments[instrumentId];
  }

  setMidiInstrument(newId){
    const foundInstrument = this.findInstrument(newId);
    this.midiSounds.cacheInstrument(foundInstrument.midiId);
    this.setState({curInstrument: foundInstrument})
  }

  componentDidMount() {
    //- TODO, documentation said to do this to init it or something?
    this.midiSounds.cacheInstrument(this.state.curInstrument.midiId);
    this.setState({curInstrument: this.state.curInstrument})
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
