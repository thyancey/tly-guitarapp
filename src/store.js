import { initStore } from 'react-waterfall';
import { List } from 'immutable';
import MusicMan from 'src/utils/musicman';
import { isObject } from 'util';


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

//- merge anything back into the store... must be in store format
const setCachedData = (obj) => {
  try{
    const jsonString = global.localStorage.getItem('tly-guitarapp') || '{}';
    const cachedData = JSON.parse(jsonString);

    global.localStorage.setItem('tly-guitarapp', JSON.stringify(Object.assign({}, cachedData, obj)));
    return true;
  }catch(e){
    console.log('error when setting cachedData', e);
    return false;
  }
}
const getCachedData = (key, fallback) => {
  try{
    const jsonString = global.localStorage.getItem('tly-guitarapp') || '{}';
    const cachedData = JSON.parse(jsonString);
    const foundItem = cachedData[key];
    
    if(isObject(foundItem)){
      return Object.assign({}, fallback, foundItem);
    }else{
      return foundItem || fallback;
    }
  }catch(e){
    console.log('error when getting cachedData', e);
    return fallback;
  }
}

const setCachedLayoutData = (layout, panelPositions) => {
  // console.log('setCachedLayoutData', layout, panelPositions);
  try{
    const jsonString = global.localStorage.getItem('tly-guitarapp') || '{}';
    const cachedData = JSON.parse(jsonString);


    cachedData.currentLayout = layout;
    cachedData.panelPositions = Object.assign({}, cachedData.panelPositions, { [ layout ]: panelPositions });

    global.localStorage.setItem('tly-guitarapp', JSON.stringify(cachedData));
    return true;
  }catch(e){
    console.log('error when setting cachedData', e);
    return false;
  }
}

const DEFAULT_SETTINGS = {
  currentLayout: 'horizontal',
  layoutGroups:{
    vertical:{
      left: ['musicKey', 'scale', 'instrument'],
      center: ['fret','chorddisplay'],
      right: ['tools', 'notedisplay', 'chord', , 'settings']
    },
    horizontal:{
      top: ['fret', 'tools'],
      bottom: ['musicKey', 'scale', 'instrument', 'notedisplay', 'chorddisplay', 'chord', 'settings']
    },
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
      scaleMode:false
    },
    keyFinderMode: 'off',
    keyFinderNotes: new List(),
    currentLayout: getCachedData('currentLayout', DEFAULT_SETTINGS.currentLayout),
    layoutGroups: getCachedData('panelPositions', DEFAULT_SETTINGS.layoutGroups),
    isDragging: false,
    dragX:-1,
    dragY:-1,
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
    setSelectionMode: ({}, newSelectionMode) => ({ selectionMode: newSelectionMode }),
    setKeyFinderMode: ({}, newMode) => {
      if(newMode === 'off'){
        return {
          keyFinderNotes: new List(),
          keyFinderMode: newMode
        }
      }else{
        return {
          keyFinderMode: newMode
        }
      }
    },
    setInstrument: ({ instrument, midiInstrument, chord, fretChanges }, newInstrument) => {
      return { 
        instrument: newInstrument,
        midiInstrument: MusicMan.getInstrumentMidiId(newInstrument),
        chord: null,
        fretChanges: fretChanges+1
      }
    },

    toggleKeyFinderNote: ({ keyFinderNotes }, note) => {
      const foundIdx = keyFinderNotes.indexOf(note);
      if(foundIdx > -1){
        return {
          keyFinderNotes: keyFinderNotes.filter(n => n !== note)
        }
      }else{
        return {
          keyFinderNotes: keyFinderNotes.push(note)
        }
      }
    },

    flipMajMinScale: ({ musicKey, scale }) => {
      const flipped = MusicMan.getMajorMinorFlip(musicKey, scale);
      
      return {
        musicKey: flipped.key,
        scale: flipped.scale
      }
    },

    /* layout customization stuff */
    setSpacerPosition: ({ spacerPosition }, newSpacerPosition) => ({ spacerPosition: newSpacerPosition }),
    dragPanel: ({ isDragging, heldPanelId }, newPanelId) => ({ 
      isDragging: true,
      heldPanelId: newPanelId
    }),
    dropPanel: ({ spacerPosition, layoutGroups, currentLayout }, panelId) => { 
      let panelPositions = layoutGroups[currentLayout];

      if(spacerPosition){
        panelPositions = removePanel(panelId, panelPositions);
        panelPositions = insertPanel(panelId, panelPositions, spacerPosition.panel, spacerPosition.index);

        const newPos = Object.assign({}, { [currentLayout]: panelPositions }, layoutGroups);

        setCachedLayoutData(currentLayout, panelPositions);

        return{
          layoutGroups: newPos,
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
    setDraggingPosition: ({dragX, dragY}, newDragX, newDragY) => {
      return{
        dragX: newDragX,
        dragY: newDragY
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

    swapLayout: ({currentLayout}) => {
        if(currentLayout === 'vertical'){
          setCachedData({ currentLayout: 'horizontal' });
          return{
            currentLayout:'horizontal'
          }
        }else{
          setCachedData({ currentLayout: 'vertical' });
          return{
            currentLayout:'vertical'
          }
        }
    },

    //- todo, this probably isn't the most react way to do something, but it works just fine for now
    dispatchMusicEvent: ({}, musicEvent) => {
      if(!global.dispatchMusicEvent){
        console.error('dispatchMusicEvent method was not defined on window.');
      }else{
        global.dispatchMusicEvent(musicEvent);
      }
      return {};
    },

    dispatchEasyMusicEvent: ({ musicKey, octave, scale }, musicEvent) => {
      
      if(!global.dispatchMusicEvent){
        console.error('dispatchMusicEvent method was not defined on window.');
      }else{
        if(musicEvent.notes){
          global.dispatchMusicEvent(musicEvent);
        }else{
          const octaveNote = `${musicEvent.musicKey || musicKey}-${musicEvent.octave || octave}`;
          const scaleNotes = MusicMan.getScale(octaveNote, musicEvent.scale || scale);
          musicEvent.notes = MusicMan.getMidiScale(scaleNotes);

          global.dispatchMusicEvent(musicEvent);
        }

      }
      return {};
    }

  }
};
 
export const { Provider, connect } = initStore(store);