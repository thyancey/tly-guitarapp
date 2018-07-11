import { initStore } from 'react-waterfall';
import {List} from 'immutable';

const store = {
  initialState: {
    notes: List.of('C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'),
    musicKey: 'C',
    scale: 'major',
    instrument: 'guitar-standard',
    octave: 2,
    chord: null,
    selectionMode:{
      noteClick:false,
      scaleMode:false
    }
  },
  actions: {
    setMusicKey: ({ musicKey }, newMusicKey) => ({ musicKey: newMusicKey }),
    setScale: ({ scale }, newScale) => ({ scale: newScale }),
    setInstrument: ({ instrument }, newInstrument) => ({ instrument: newInstrument }),
    setOctave: ({ octave }, newOctave) => ({ octave: newOctave }),
    setChord: ({ chord }, newChord) => ({ chord: newChord }),
    setSelectionMode: ({ selectionMode }, newSelectionMode) => ({ selectionMode: newSelectionMode })
  }
};
 
export const { Provider, connect } = initStore(store);