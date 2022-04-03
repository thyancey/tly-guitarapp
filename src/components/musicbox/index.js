import React, { Component } from 'react';

import MIDISounds from 'midi-sounds-react';
import MIDI_INSTRUMENT_DATA from 'src/data/mididata.js';

require('./style.less');

const SCALE_SPEED = .25;
const SUSTAIN_VALUES = {
  NOTE:.25,
  SCALE:.5,
  CHORD:.5,
  STRUM_UP:.25,
  STRUM_DOWN:.25,
  SNAP:0.5
}

export const PLAY_TYPES = [ 'NOTE', 'SCALE', 'SCALE_FULL', 'CHORD', 'STRUM_UP', 'STRUM_DOWN', 'SNAP' ];

export default class MusicBox extends Component {
  constructor(){
    super();
    this.mounted = false;
    this.state = {
      curInstrument: this.findInstrument()
    };
  }
  
  getInstrument(id){
    return MIDI_INSTRUMENT_DATA.instruments[id];
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
  
  getSustain(midiInstrumentId, type){
    const instra = this.getInstrument(midiInstrumentId)
    const sust = (instra && instra.sustain) || SUSTAIN_VALUES[type];
    return sust;
  }

  playNotes(midiNotes, type, midiInstrument){
    const sustain = this.getSustain(midiInstrument, type);

    switch(type){
      case 'NOTE': this.midiSounds.playChordNow(this.state.curInstrument.midiId, midiNotes, sustain);
        break;
      case 'SCALE': 
        this.midiSounds.cancelQueue();
        this.playScale(midiNotes);
        break;
      case 'SCALE_FULL': 
        this.midiSounds.cancelQueue();
        this.playFullScale(midiNotes);
        break;
      case 'CHORD': this.midiSounds.playChordNow(this.state.curInstrument.midiId, midiNotes, sustain);
        break;
      case 'STRUM_UP': this.midiSounds.playStrumUpNow(this.state.curInstrument.midiId, midiNotes, sustain);
        break;
      case 'STRUM_DOWN': this.midiSounds.playStrumDownNow(this.state.curInstrument.midiId, midiNotes, sustain);
        break;
      case 'SNAP': this.midiSounds.playSnapNow(this.state.curInstrument.midiId, midiNotes, sustain);
        break;
    }
  }

  findInstrument(instrumentId){
    if(!instrumentId){
      instrumentId = MIDI_INSTRUMENT_DATA.defaultInstrument;
    }
    return { ...MIDI_INSTRUMENT_DATA.instruments[instrumentId], id: instrumentId }
  }

  setMidiInstrument(newId){
    const foundInstrument = this.findInstrument(newId);
    this.midiSounds.cacheInstrument(foundInstrument.midiId);
    this.setState({curInstrument: foundInstrument})
  }

  componentDidMount() {
    if(!this.mounted){
      this.mounted = true;
      //- TODO, documentation said to do this to init it or something?
      this.midiSounds.cacheInstrument(this.state.curInstrument.midiId);
      this.setState({curInstrument: this.state.curInstrument})
      this.setVolume(this.props.volume);
    }
  }

  componentDidUpdate(prevProps){
    if(prevProps.midiInstrument !== this.props.midiInstrument){
      this.setMidiInstrument(this.props.midiInstrument);
    } else if(this.state.curInstrument && this.state.curInstrument.id !== this.props.midiInstrument){
      this.setMidiInstrument(this.props.midiInstrument);
    }
    
    if(prevProps.volume !== this.props.volume){
      this.setVolume(this.props.volume);
    }
  }

  onMusicEvent(musicEvent){
    this.playNotes(musicEvent.notes, musicEvent.type, musicEvent.midiInstrument);
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
