import { initStore } from 'react-waterfall';
import {List} from 'immutable';
import MusicMan from 'src/utils/musicman';

const store = {
  initialState: {
    notes: List.of('C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'),
    musicKey: 'C',
    scale: 'major',
    instrument: 'guitar-standard',
    midiInstrument: 'electricGuitar',
    octave: 2,
    chord: null,
    volume: .4,
    fretChanges: 0,
    selectionMode:{
      noteClick:false,
      scaleMode:false
    }
  },
  actions: {
    setMusicKey: ({ musicKey, fretChanges }, newMusicKey) => ({ musicKey: newMusicKey, fretChanges: fretChanges+1 }),
    setScale: ({ scale, fretChanges }, newScale) => ({ scale: newScale, fretChanges: fretChanges+1 }),
    setInstrument: ({ instrument, midiInstrument, chord, fretChanges }, newInstrument) => {
      return { 
        instrument: newInstrument,
        midiInstrument: MusicMan.getInstrumentMidiId(newInstrument),
        chord: null,
        fretChanges: fretChanges+1
      }
    },
    setVolume: ({ volume }, newVolume) => ({ volume: newVolume }),
    setOctave: ({ octave, fretChanges }, newOctave) => ({ octave: newOctave, fretChanges: fretChanges+1 }),
    setChord: ({ chord, fretChanges }, newChord) => ({ chord: newChord, fretChanges: fretChanges+1 }),
    setSelectionMode: ({ selectionMode }, newSelectionMode) => ({ selectionMode: newSelectionMode }),
    dispatchMusicEvent: ({}, musicEvent) => {
      if(!global.dispatchMusicEvent){
        console.error('dispatchMusicEvent method was not defined on window.');
      }else{
        global.dispatchMusicEvent(musicEvent);
      }
      return {};
    }
  }
};
 
export const { Provider, connect } = initStore(store);