import { initStore } from 'react-waterfall';
import {List} from 'immutable';
import MusicMan from 'src/utils/musicman';

const allElementsFromPoint = (x, y) => {
  var element, elements = [];
  var old_visibility = [];
  while (true) {
    element = document.elementFromPoint(x, y);
    if (!element || element === document.documentElement) {
        break;
    }
    elements.push(element);
    old_visibility.push(element.style.visibility);
    element.style.visibility = 'hidden'; // Temporarily hide the element (without changing the layout)
  }
  for (var k = 0; k < elements.length; k++) {
    elements[k].style.visibility = old_visibility[k];
  }
  elements.reverse();
  return elements;
}

const removePanel = (panelId, panelPositions) => {
  // console.log('removing ', panelId);
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
  panelPositions[targetPanel].splice(targetIndex, 0, panelId);
  return panelPositions;
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
    panelPositions: {
      left: ['musicKey', 'scale'],
      center: ['notedisplay', 'fret'],
      right: ['chord', 'instrument', 'tools']
    },
    isDragging: false,
    spacerPosition:null,
    heldPanel:null,
    heldPanelId:null,
    panelChanges: 0
  },
  actions: {
    setMusicKey: ({ musicKey, fretChanges }, newMusicKey) => ({ musicKey: newMusicKey, fretChanges: fretChanges+1 }),
    setScale: ({ scale, fretChanges }, newScale) => ({ scale: newScale, fretChanges: fretChanges+1 }),
    setSpacerPosition: ({ spacerPosition }, newSpacerPosition) => ({ spacerPosition: newSpacerPosition }),
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
    dragPanel: ({ isDragging, heldPanel, heldPanelId }, newPanel) => ({ 
      isDragging: true,
      heldPanel: newPanel,
      heldPanelId: newPanel.id
    }),
    dropPanel: ({ isDragging, spacerPosition, panelPositions, heldPanel, heldPanelId }, panelId) => { 
      if(spacerPosition){
        // console.log('spacerPosition ', spacerPosition);
        panelPositions = removePanel(panelId, panelPositions);
        panelPositions = insertPanel(panelId, panelPositions, spacerPosition.panel, spacerPosition.index);
      }else{

      }

      return{
        panelPositions: panelPositions,
        spacerPosition:null,
        heldPanel: null,
        heldPanelId: null,
        isDragging: false 
      }
    },
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