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

const getFretMatrix = (musicKey, scale, chord, instrumentLabel, fretMatrix) => {
  // console.log('getFretMatrix', musicKey, scale, chord, instrumentLabel)
  const notes = MusicMan.getScale(musicKey, scale);
  const maxFrets = MusicMan.getInstrumentNumFrets(instrumentLabel);
  
  const chordFretIdxs = MusicMan.getChordFretIdxs(chord, instrumentLabel);
  const instrumentObj = MusicMan.getInstrumentNotesFromLabel(instrumentLabel);
  const strings = instrumentObj.strings;
  const fretBounds = instrumentObj.fretBounds;

  // console.log('maxFrets:' , maxFrets);
  // console.log('fretBounds:' , fretBounds);
  // console.log('strings:' , strings);
  // console.log('notes:' , notes);
  // console.log('chordFretIdxs:' , chordFretIdxs);

  const stringsMatrix = MusicMan.convertToStringsMatrix(strings, notes, fretBounds);
  // console.log('fretMatrix is ', stringsMatrix.toJS());
  if(chordFretIdxs.length > 0){
    const finalStringsMatrix = MusicMan.filterFretMatrixForChords(stringsMatrix, chordFretIdxs)
    // console.log('finalStringsMatrix is ', finalStringsMatrix.toJS());
    return finalStringsMatrix;
  }else{
    return stringsMatrix;
  }
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
const prepareForNewMusicKey = (newMusicKey, fretMatrix, fretChanges) => {
  return { 
    fretMatrix: fretMatrix,
    musicKey: newMusicKey, 
    chord: null,
    fretChanges: fretChanges+1 
  };
}

const prepareForSetOctave = (newOctave, fretChanges) => {
  return { 
    octave: newOctave, 
    fretChanges: fretChanges+1 
  }
}

const prepareForSetFoundNote = (note, keyFinderNotes) => {
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
}

const prepareForSetScale = (scale, fretMatrix, fretChanges) => {
  return { 
    chord: null, 
    scale: scale, 
    fretMatrix: fretMatrix,
    fretChanges: fretChanges+1 
  };
}

const prepareForSetChord = (newChord, fretMatrix, fretChanges) => {
  return { 
    chord: newChord, 
    fretMatrix: fretMatrix,
    fretChanges: fretChanges+1 
  }
}

const prepareForSetInstrument = (newInstrument, newMidiInstrument, fretMatrix, fretChanges) => {
  return { 
    instrument: newInstrument,
    midiInstrument: newMidiInstrument,
    fretMatrix: fretMatrix,
    chord: null,
    fretChanges: fretChanges+1
  }
}

const prepareForFlipWesternScale = (newKey, newScale, fretMatrix, fretChanges) => {
  return {
    musicKey: newKey,
    scale: newScale,
    fretMatrix: fretMatrix,
    fretChanges: fretChanges+1
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
    midiInstrument: 'electricGuitar',
    octave: 2,
    chord: null,
    volume: .4,
    fretChanges: 0,
    playMode: 'note',
    keyFinderMode: 'off',
    keyFinderNotes: new List(),
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
    setMusicKey: ({ fretChanges, scale, chord, instrument }, newMusicKey) => {
      // console.log('-> setMusicKey', newMusicKey);
      const fretMatrix = getFretMatrix(newMusicKey, scale, chord, instrument);
      return prepareForNewMusicKey(newMusicKey, fretMatrix, fretChanges);
    },
    setScale: ({ musicKey, fretChanges, instrument }, newScale) => {
      // console.log('-> setScale', newScale);
      const fretMatrix = getFretMatrix(musicKey, newScale, null, instrument);
      return prepareForSetScale(newScale, fretMatrix, fretChanges)
    },
    setChord: ({ fretChanges, musicKey, scale, instrument }, newChord) => {
      // console.log('-> setChord', newChord);
      const fretMatrix = getFretMatrix(musicKey, scale, newChord, instrument);
      return prepareForSetChord(newChord, fretMatrix, fretChanges)
    },
    setInstrument: ({ fretChanges, musicKey, scale, chord }, newInstrument) => {
      const fretMatrix = getFretMatrix(musicKey, scale, chord, newInstrument);
      const midiInstrument = MusicMan.getInstrumentMidiId(newInstrument);
      // console.log('-> setInstrument', newInstrument);
      return prepareForSetInstrument(newInstrument, midiInstrument, fretMatrix, fretChanges);
    },
    setOctave: ({ octave, fretChanges }, newOctave) => {
      // console.log('-> setOctave', newOctave);
      return prepareForSetOctave(newOctave, fretChanges);
    },
    setFoundNote: ({ keyFinderNotes }, note) => {
      return prepareForSetFoundNote(note, keyFinderNotes);
    },
    flipWesternScale: ({ musicKey, scale, chord, instrument, fretChanges }) => {
      // console.log('-> flipWesternScale', flipped.scale);
      const flipped = MusicMan.getMajorMinorFlip(musicKey, scale);
      const fretMatrix = getFretMatrix(flipped.key, flipped.scale, chord, instrument);

      return prepareForFlipWesternScale(flipped.key, flipped.scale, fretMatrix, fretChanges);
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
    setMidiInstrument: ({ fretChanges }, newInstrument) => {
      return { 
        midiInstrument: newInstrument
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

    onFretSelected: ({ keyFinderMode, fretChanges, playMode, scale, keyFinderNotes, instrument, chord }, noteObj) => {
      let results = {};
      const fretMatrix = getFretMatrix(noteObj.simpleNote, scale, chord, instrument);

      if(noteObj.isFindModifierPressed || keyFinderMode === 'find'){
        results = Object.assign({}, results, prepareForSetFoundNote(noteObj.simpleNote, keyFinderNotes));
      }else if(noteObj.isSetModifierPressed || keyFinderMode === 'set'){
        results = Object.assign({}, results, prepareForNewMusicKey(noteObj.simpleNote, fretMatrix, fretChanges));
        results = Object.assign({}, results, prepareForSetOctave(noteObj.octave, results.fretChanges));
      }
  
      if(playMode === 'scale'){
        triggerSound('SCALE_FULL', noteObj.octaveNote, scale);
      }else{
        triggerSound('NOTE', noteObj.octaveNote, scale);
      }

      return results;
    }
  }
};
 
export const { Provider, connect } = initStore(store);