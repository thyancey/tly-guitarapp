import { initStore } from 'react-waterfall';
import {List} from 'immutable';
import MusicMan from 'src/utils/musicman';


const removePanel = (panelId, panelPositions) => {
  // console.log('removePanel ', panelId);
  for(var position in panelPositions){
    for(let i = 0; i < panelPositions[position].length; i++){
      if(panelPositions[position][i] === panelId){
        panelPositions[position].splice(i, 1);
        return panelPositions;
      }
    }
  }

  return panelPositions;
}

const insertPanel = (panelId, panelPositions, targetPanel, targetIndex) => {
  // console.log('insertPanel ', panelId);
  panelPositions[targetPanel].splice(targetIndex, 0, panelId);
  return panelPositions;
}

const getCachedData = (key, fallback) => {
  try{
    const jsonString = global.localStorage.getItem('tly-guitarapp') || '{}';
    const cachedData = JSON.parse(jsonString);

    return cachedData[key] || fallback;
  }catch(e){
    console.log('error when getting cachedData', e);
    return fallback;
  }
}

const setCachedData = (key, value) => {
  // console.log('setCachedData', key, value);
  try{
    const jsonString = global.localStorage.getItem('tly-guitarapp') || '{}';
    const cachedData = JSON.parse(jsonString);
    cachedData[key] = value;

    global.localStorage.setItem('tly-guitarapp', JSON.stringify(cachedData));
    return true;
  }catch(e){
    console.log('error when setting cachedData', e);
    return false;
  }
}

const DEFAULT_SETTINGS = {
  layout:{
    left: ['musicKey', 'scale', 'instrument'],
    center: ['fret'],
    right: ['tools', 'notedisplay', 'chorddisplay', 'chord']
  }
}

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
    },
    panelPositions: getCachedData('panelPositions', DEFAULT_SETTINGS.layout),
    isDragging: false,
    spacerPosition:null,
    heldPanelId:null,
    panelChanges: 0
  },
  actions: {
    setMusicKey: ({ musicKey, fretChanges }, newMusicKey) => ({ 
      musicKey: newMusicKey, 
      chord: null,
      fretChanges: fretChanges+1 
    }),
    setScale: ({ scale, fretChanges }, newScale) => ({ scale: newScale, fretChanges: fretChanges+1 }),
    setVolume: ({ volume }, newVolume) => ({ volume: newVolume }),
    setOctave: ({ octave, fretChanges }, newOctave) => ({ octave: newOctave, fretChanges: fretChanges+1 }),
    setChord: ({ chord, fretChanges }, newChord) => ({ chord: newChord, fretChanges: fretChanges+1 }),
    setSelectionMode: ({ selectionMode }, newSelectionMode) => ({ selectionMode: newSelectionMode }),
    setInstrument: ({ instrument, midiInstrument, chord, fretChanges }, newInstrument) => {
      return { 
        instrument: newInstrument,
        midiInstrument: MusicMan.getInstrumentMidiId(newInstrument),
        chord: null,
        fretChanges: fretChanges+1
      }
    },

    /* layout customization stuff */
    setSpacerPosition: ({ spacerPosition }, newSpacerPosition) => ({ spacerPosition: newSpacerPosition }),
    dragPanel: ({ isDragging, heldPanelId }, newPanelId) => ({ 
      isDragging: true,
      heldPanelId: newPanelId
    }),
    dropPanel: ({ isDragging, spacerPosition, panelPositions, heldPanelId }, panelId) => { 
      if(spacerPosition){
        panelPositions = removePanel(panelId, panelPositions);
        panelPositions = insertPanel(panelId, panelPositions, spacerPosition.panel, spacerPosition.index);

        setCachedData('panelPositions', panelPositions);

        return{
          panelPositions: panelPositions,
          spacerPosition:null,
          heldPanelId: null,
          isDragging: false 
        }
      }else{
        return{
          spacerPosition:null,
          heldPanelId: null,
          isDragging: false 
        }
      }
    },

    setDefaultSettings(){
      try{
        global.localStorage.removeItem('tly-guitarapp');
        global.location.reload();
      }catch(e){
        global.location.reload();
      }
      return {};
    },

    //- todo, this probably isn't the most react way to do something, but it works just fine for now
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