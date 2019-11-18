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

  const stringsMatrix = MusicMan.convertToStringsMatrix(strings, notes, fretBounds, keyFinderNotes);
  // console.log('fretMatrix is ', stringsMatrix.toJS());
  if(chordFretIdxs.length > 0){
    const finalStringsMatrix = MusicMan.filterFretMatrixForChords(stringsMatrix, chordFretIdxs)
    // console.log('finalStringsMatrix is ', finalStringsMatrix.toJS());
    return finalStringsMatrix;
  }else{
    // console.log('getFretMatrix returning:', stringsMatrix.toJS()[0].frets.toJS());
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
    musicKey: newMusicKey, 
    chord: null,
    fretMatrix: fretMatrix,
    fretChanges: fretChanges+1 
  };
}

const prepareForSetOctave = (newOctave, fretChanges) => {
  return { 
    octave: newOctave, 
    fretChanges: fretChanges+1 
  }
}

const prepareForSetFoundNote = (note, keyFinderNotes, fretChanges) => {
  const foundIdx = keyFinderNotes.indexOf(note);
  if(foundIdx > -1){
    return {
      keyFinderNotes: keyFinderNotes.filter(n => n !== note),
      fretChanges: fretChanges+1 
    }
  }else{
    return {
      keyFinderNotes: keyFinderNotes.push(note),
      fretChanges: fretChanges+1 
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
    maxFrets: MusicMan.getInstrumentNumFrets(newInstrument),
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
    maxFrets: 20,
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
    refreshFretMatrix: ({ musicKey, scale, chord, instrument, keyFinderNotes }) => {
      return {
        fretMatrix: getFretMatrix(musicKey, scale, chord, instrument, keyFinderNotes)
      };
    },
    setMusicKey: ({ fretChanges, scale, chord, instrument, keyFinderNotes }, newMusicKey) => {
      console.log('-> setMusicKey', newMusicKey);
      const fretMatrix = getFretMatrix(newMusicKey, scale, chord, instrument, keyFinderNotes);
      return prepareForNewMusicKey(newMusicKey, fretMatrix, fretChanges);
    },
    setScale: ({ musicKey, fretChanges, instrument, keyFinderNotes }, newScale) => {
      // console.log('-> setScale', newScale);
      const fretMatrix = getFretMatrix(musicKey, newScale, null, instrument, keyFinderNotes);
      return prepareForSetScale(newScale, fretMatrix, fretChanges)
    },
    setChord: ({ fretChanges, musicKey, scale, instrument, keyFinderNotes }, newChord) => {
      // console.log('-> setChord', newChord);
      const fretMatrix = getFretMatrix(musicKey, scale, newChord, instrument, keyFinderNotes);
      return prepareForSetChord(newChord, fretMatrix, fretChanges)
    },
    setInstrument: ({ fretChanges, musicKey, scale, chord , keyFinderNotes}, newInstrument) => {
      const fretMatrix = getFretMatrix(musicKey, scale, chord, newInstrument, keyFinderNotes);
      const midiInstrument = MusicMan.getInstrumentMidiId(newInstrument);
      // console.log('-> setInstrument', newInstrument);
      return prepareForSetInstrument(newInstrument, midiInstrument, fretMatrix, fretChanges);
    },
    setOctave: ({ fretChanges }, newOctave) => {
      // console.log('-> setOctave', newOctave);
      return prepareForSetOctave(newOctave, fretChanges);
    },
    setFoundNote: ({ keyFinderNotes, fretChanges }, note) => {
      return prepareForSetFoundNote(note, keyFinderNotes, fretChanges);
    },
    flipWesternScale: ({ musicKey, scale, chord, instrument, fretChanges, keyFinderNotes }) => {
      // console.log('-> flipWesternScale', flipped.scale);
      const flipped = MusicMan.getMajorMinorFlip(musicKey, scale);
      const fretMatrix = getFretMatrix(flipped.key, flipped.scale, chord, instrument, keyFinderNotes);

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

    //- TODO: this method needs A LOT OF HELP
    onFretSelected: ({ keyFinderMode, musicKey, fretChanges, playMode, scale, keyFinderNotes, instrument, chord }, noteObj) => {
      let results = {};
      let fretMatrix;

      if(noteObj.isFindModifierPressed || keyFinderMode === 'find'){
        results = Object.assign({}, results, prepareForSetFoundNote(noteObj.simpleNote, keyFinderNotes, fretChanges));

        //- since results changed, recalc and save fretMatrix
        fretMatrix = getFretMatrix(noteObj.simpleNote, scale, chord, instrument, results.keyFinderNotes);
        results = Object.assign({}, results, { fretMatrix: fretMatrix });
      }

      if(noteObj.isSetModifierPressed || keyFinderMode === 'set'){
        //- perferably use altered fretmatrix
        fretMatrix = results.fretMatrix || getFretMatrix(musicKey, scale, chord, instrument, keyFinderNotes);

        results = Object.assign({}, results, prepareForNewMusicKey(noteObj.simpleNote, fretMatrix, results.fretChanges));
        results = Object.assign({}, results, prepareForSetOctave(noteObj.octave, results.fretChanges));
        
        results.fretMatrix = getFretMatrix(results.musicKey, scale, chord, instrument, results.keyFinderNotes);
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