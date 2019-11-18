import { initStore } from 'react-waterfall';
import { Map, List } from 'immutable';
import MusicMan from 'src/utils/musicman';
import { isObject } from 'util';
import { PLAY_TYPES } from 'src/components/musicbox';

const triggerSound = (type, octaveNote, scale, dispatchMusicEvent) => {
  if(PLAY_TYPES.indexOf(type) === -1){
    console.error(`given type "${type}" is not a valid note trigger type. Available types: ${PLAY_TYPES}`);
    return null;
  }else{
    if(type === 'NOTE'){
      const midiNote = MusicMan.getMidiNote(octaveNote);
      global.dispatchMusicEvent({
        type: type,
        notes: [midiNote]
      });
    }else{
      const octaveNotes = MusicMan.getScale(octaveNote, scale);
      const midiNotes = MusicMan.getMidiScale(octaveNotes);
      global.dispatchMusicEvent({
        type: type,
        notes: midiNotes
      });
    }
  }

}

const getFretMatrix = (musicKey, scale, chord, instrumentLabel, keyFinderNotes) => {
  // console.log('getFretMatrix', musicKey, scale, chord, instrumentLabel)
  const notes = MusicMan.getScale(musicKey, scale);
  // const maxFrets = MusicMan.getInstrumentNumFrets(instrumentLabel);
  
  const chordFretIdxs = MusicMan.getChordFretIdxs(chord, instrumentLabel);
  const instrumentObj = MusicMan.getInstrumentNotesFromLabel(instrumentLabel);
  const strings = instrumentObj.strings;
  const fretBounds = instrumentObj.fretBounds;

  const stringsMatrix = MusicMan.convertToStringsMatrix(strings, notes, fretBounds, keyFinderNotes, chordFretIdxs);

  return stringsMatrix;
}


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

//- these prepare methods exist because I should really be using redux, should be using selectors,
//- and didnt have time to figure out how to chain actions with this
//- more or less are helping to change multiple things in the store at once
//- used later on by merging multiple results of these calls together
const prepareForNewMusicKey = (newMusicKey) => {
  return { 
    musicKey: newMusicKey, 
    chord: null,
    keyFinderNotes: []
  };
}

const prepareForSetOctave = (newOctave) => {
  return { 
    octave: newOctave
  }
}

const prepareForSetFoundNote = (note, keyFinderNotes) => {
  const foundIdx = keyFinderNotes.indexOf(note);
  if(foundIdx > -1){
    return {
      keyFinderNotes: keyFinderNotes.filter(n => n !== note)
    }
  }else{
    keyFinderNotes.push(note);
    return {
      keyFinderNotes: keyFinderNotes
    }
  }
}

const prepareForSetScale = (scale) => {
  return { 
    chord: null, 
    scale: scale
  };
}

const prepareForSetChord = (newChord) => {
  return { 
    chord: newChord
  }
}

const prepareForSetInstrument = (newInstrument, newMidiInstrument) => {
  return { 
    instrument: newInstrument,
    midiInstrument: newMidiInstrument,
    chord: null,
    maxFrets: MusicMan.getInstrumentNumFrets(newInstrument)
  }
}

const prepareForFlipWesternScale = (newKey, newScale) => {
  return {
    musicKey: newKey,
    scale: newScale
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
      top: ['fret'],
      bottom: ['tools','settings','musicKey', 'scale', 'instrument', 'notedisplay', 'chorddisplay', 'chord']
    },
  }
}

const store = {
  initialState: {
    notes: List.of('C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'),
    musicKey: 'C',
    scale: 'major',
    instrument: 'guitar-standard',
    maxFrets: 20,
    midiInstrument: 'electricGuitar',
    octave: 2,
    chord: null,
    volume: .4,
    fretChanges: 0,
    playMode: 'note',
    keyFinderMode: 'off',
    keyFinderNotes: [],
    currentLayout: getCachedData('currentLayout', DEFAULT_SETTINGS.currentLayout),
    layoutGroups: getCachedData('panelPositions', DEFAULT_SETTINGS.layoutGroups),
    isDragging: false,
    dragX:-1,
    dragY:-1,
    spacerPosition:null,
    heldPanelId:null,
    panelChanges: 0,
    fretMatrix: new List([])
  },
  actions: {
    seemsLikeThisIsUnecessaryButWhateverJustStartTheStoreCorrectly: ({ musicKey, scale, chord, instrument, midiInstrument, keyFinderNotes }) => {
      return {
        maxFrets: MusicMan.getInstrumentNumFrets(instrument),
        fretMatrix: getFretMatrix(musicKey, scale, chord, instrument, keyFinderNotes),
        instrument: instrument,
        midiInstrument: midiInstrument,
      };
    },
    setMusicKey: ({ fretChanges, scale, chord, instrument }, newMusicKey) => {
      const fretMatrix = getFretMatrix(newMusicKey, scale, chord, instrument, []);

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewMusicKey(newMusicKey));
    },
    setScale: ({ musicKey, fretChanges, instrument, keyFinderNotes }, newScale) => {
      // console.log('-> setScale', newScale);
      const fretMatrix = getFretMatrix(musicKey, newScale, null, instrument, keyFinderNotes);

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetScale(newScale));
    },
    setChord: ({ fretChanges, musicKey, scale, instrument, keyFinderNotes }, newChord) => {
      // console.log('-> setChord', newChord);
      const fretMatrix = getFretMatrix(musicKey, scale, newChord, instrument, keyFinderNotes);
      
      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetChord(newChord));
    },
    setInstrument: ({ fretChanges, musicKey, scale, chord , keyFinderNotes}, newInstrument) => {
      const fretMatrix = getFretMatrix(musicKey, scale, chord, newInstrument, keyFinderNotes);
      const midiInstrument = MusicMan.getInstrumentMidiId(newInstrument);

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetInstrument(newInstrument, midiInstrument));
    },
    setOctave: ({ fretChanges }, newOctave) => {

      return Object.assign({ 
        fretChanges: fretChanges+1
      }, prepareForSetOctave(newOctave));
    },
    setFoundNote: ({ keyFinderNotes, fretChanges }, note) => {
      console.log('-> setFoundNote')
      return Object.assign({ 
        fretChanges: fretChanges+1
      }, prepareForSetFoundNote(note, keyFinderNotes));
    },
    flipWesternScale: ({ musicKey, scale, chord, instrument, fretChanges, keyFinderNotes }) => {
      // console.log('-> flipWesternScale', flipped.scale);
      const flipped = MusicMan.getMajorMinorFlip(musicKey, scale);
      const fretMatrix = getFretMatrix(flipped.key, flipped.scale, chord, instrument, keyFinderNotes);

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForFlipWesternScale(flipped.key, flipped.scale));
    },
    setPlayMode: ({}, newPlayMode) => { 
      console.log('----> set play mode', newPlayMode)
      return {
        playMode: newPlayMode 
      }
    },
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
    setVolume: ({ volume }, newVolume) => ({ volume: newVolume }),
    setMidiInstrument: ({ fretChanges, instrument }, newMidiInstrument) => {

      return Object.assign({ 
        fretChanges: fretChanges+1
      }, prepareForSetInstrument(instrument, newMidiInstrument));
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
    },

    //- TODO: this method needs A LOT OF HELP
    onFretSelected: ({ keyFinderMode, musicKey, fretChanges, playMode, scale, keyFinderNotes, instrument, chord }, noteObj) => {
      let results = {};
      let fretMatrix;
      let wasModified = false;

      if(noteObj.isFindModifierPressed || keyFinderMode === 'find'){
        wasModified = true;
        results = Object.assign({}, results, prepareForSetFoundNote(noteObj.simpleNote, keyFinderNotes));

        //- since results changed, recalc and save fretMatrix
        fretMatrix = getFretMatrix(musicKey, scale, chord, instrument, results.keyFinderNotes);
        results = Object.assign({}, results, { fretMatrix: fretMatrix });
      }

      if(noteObj.isSetModifierPressed || keyFinderMode === 'set'){
        wasModified = true;
        //- perferably use altered fretmatrix
        fretMatrix = results.fretMatrix || getFretMatrix(musicKey, scale, chord, instrument, []);

        results = Object.assign({}, results, prepareForNewMusicKey(noteObj.simpleNote));

        results = Object.assign({}, results, prepareForSetOctave(noteObj.octave));
        
        results.fretMatrix = getFretMatrix(results.musicKey, scale, chord, instrument, results.keyFinderNotes);
        // results.keyFinderNotes = [];
      }
  
      if(playMode === 'scale'){
        triggerSound('SCALE_FULL', noteObj.octaveNote, scale);
      }else{
        triggerSound('NOTE', noteObj.octaveNote, scale);
      }

      if(wasModified){
        results.fretChanges = fretChanges+1;
      }
      return results;
    }
  }
};
 
export const { Provider, connect } = initStore(store);