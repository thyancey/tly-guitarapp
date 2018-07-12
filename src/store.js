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
    selectionMode:{
      noteClick:false,
      scaleMode:false
    }
  },
  actions: {
    setMusicKey: ({ musicKey }, newMusicKey) => ({ musicKey: newMusicKey }),
    setScale: ({ scale }, newScale) => ({ scale: newScale }),
    setInstrument: ({ instrument, midiInstrument, chord }, newInstrument) => {
      return { 
        instrument: newInstrument,
        midiInstrument: MusicMan.getInstrumentMidiId(newInstrument),
        chord: null
      }
    },
    setVolume: ({ volume }, newVolume) => ({ volume: newVolume }),
    setOctave: ({ octave }, newOctave) => ({ octave: newOctave }),
    setChord: ({ chord }, newChord) => ({ chord: newChord }),
    setSelectionMode: ({ selectionMode }, newSelectionMode) => ({ selectionMode: newSelectionMode })
  }
};
 
export const { Provider, connect } = initStore(store);