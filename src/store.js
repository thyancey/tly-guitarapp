import { initStore } from 'react-waterfall';
import { Map, List } from 'immutable';
import MusicMan from 'src/utils/musicman';
import { isObject } from 'util';
import Tools from 'src/utils/tools';
import { PLAY_TYPES } from 'src/components/musicbox';

const triggerSound = (type, octaveNote, scale, mode, midiInstrument) => {
  if(PLAY_TYPES.indexOf(type) === -1){
    console.error(`given type "${type}" is not a valid note trigger type. Available types: ${PLAY_TYPES}`);
    return null;
  }else{
    if(type === 'NOTE'){
      const midiNote = MusicMan.getMidiNote(octaveNote);
      global.dispatchMusicEvent({
        type: type,
        notes: [midiNote],
        midiInstrument: midiInstrument
      });
    }else{
      const octaveNotes = MusicMan.getScale(octaveNote, scale, mode);
      const midiNotes = MusicMan.getMidiScale(octaveNotes);
      global.dispatchMusicEvent({
        type: type,
        notes: midiNotes,
        midiInstrument: midiInstrument
      });
    }
  }

}

const getFretMatrix = (data) => {
  // TODO_MODE
  const notes = MusicMan.getScale(data.musicKey, data.scale, data.mode);
  // const maxFrets = MusicMan.getInstrumentNumFrets(instrument);
  
  const chordFretIdxs = MusicMan.getChordFretIdxs(data.chord || null, data.instrument);
  const instrumentObj = MusicMan.getInstrumentNotesFromLabel(data.instrument);
  const patternObj = MusicMan.getPattern(data.pattern || null);
  const strings = instrumentObj.strings;
  const fretBounds = instrumentObj.fretBounds;

  const stringsMatrix = MusicMan.convertToStringsMatrix(strings, notes, fretBounds, data.keyFinderNotes || [], chordFretIdxs, patternObj);

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

const prepareForNewMode = (newMode) => {
  return { 
    mode: newMode, 
    chord: null,
    keyFinderNotes: []
  };
}

const prepareForNewPattern = (newPattern) => {
  return { 
    pattern: newPattern, 
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
      pattern: null,
      keyFinderNotes: keyFinderNotes.filter(n => n !== note)
    }
  }else{
    keyFinderNotes.push(note);
    return {
      pattern: null,
      keyFinderNotes: keyFinderNotes
    }
  }
}

const prepareForSetScale = (scale) => {
  const scaleRegion = MusicMan.getScaleRegion(scale);

  return { 
    chord: null, 
    scale: scale,
    scaleRegion: scaleRegion,
    pattern: null,
    keyFinderNotes: []
  };
}

const prepareForSetChord = (newChord) => {
  return { 
    chord: newChord
  }
}

const prepareForSetInstrument = (newInstrument, newMidiInstrument) => {
  console.warn('prepareForSetInstrument', newMidiInstrument);
  return { 
    instrument: newInstrument,
    midiInstrument: newMidiInstrument,
    chord: null,
    maxFrets: MusicMan.getInstrumentNumFrets(newInstrument)
  }
}

const prepareForFlipWesternScale = (newKey, newScale) => {
  const scaleRegion = MusicMan.getScaleRegion(newScale);
  return {
    musicKey: newKey,
    scale: newScale,
    scaleRegion: scaleRegion
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

const DEFAULT_LAYOUT_GROUPS = {
  vertical:{
    left: ['musicKey', 'scale', 'instrument'],
    center: ['fret','chorddisplay'],
    right: ['tools', 'notedisplay', 'chord', 'settings']
  },
  horizontal:{
    top: ['fret', 'tools' ],
    bottom: ['scale', 'mode', 'musicKey','instrument','pattern']
  }
}

const store = {
  initialState: {
    notes: List.of('C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'),
    musicKey: getCachedData('musicKey', 'C'),
    scale: getCachedData('scale', 'major'),
    scaleRegion: 'western',
    instrument: getCachedData('instrument', 'guitar-standard'),
    maxFrets: 20,
    midiInstrument: getCachedData('midiInstrument', 'pizzicato'),
    octave: 2,
    mode: getCachedData('mode', 0),
    pattern: getCachedData('pattern', null),
    chord: null,
    volume: getCachedData('volume', 0.2),
    fretChanges: 0,
    playMode: 'note',
    keyFinderMode: 'off',
    keyFinderNotes: [],
    currentLayout: getCachedData('currentLayout', 'horizontal'),
    layoutGroups: getCachedData('panelPositions', DEFAULT_LAYOUT_GROUPS),
    isDragging: false,
    dragX:-1,
    dragY:-1,
    spacerPosition:null,
    heldPanelId:null,
    panelChanges: 0,
    fretMatrix: new List([])
  },
  actions: {
    seemsLikeThisIsUnecessaryButWhateverJustStartTheStoreCorrectly: ({ musicKey, scale, chord, instrument, midiInstrument, keyFinderNotes, mode }) => {
      return {
        maxFrets: MusicMan.getInstrumentNumFrets(instrument),
        fretMatrix: getFretMatrix({
          musicKey,
          scale,
          chord,
          instrument,
          keyFinderNotes,
          mode
        }),
        instrument: instrument,
        midiInstrument: midiInstrument,
      };
    },
    setMusicKey: ({ fretChanges, scale, chord, instrument, pattern, mode }, musicKey) => {
      console.log('setMusicKey', musicKey);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        pattern,
        mode
      });

      setCachedData({
        musicKey: musicKey
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewMusicKey(musicKey));
    },
    setPattern: ({ musicKey, fretChanges, scale, instrument, mode }, pattern) => {
      // console.log('setPattern', newPattern);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        instrument,
        pattern,
        mode
      });
      
      setCachedData({
        pattern: pattern
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewPattern(pattern));
    },
    setScale: ({ musicKey, fretChanges, instrument, mode }, newScale) => {
      console.log('-> setScale', newScale);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale: newScale,
        instrument,
        mode
      });

      setCachedData({
        scale: newScale
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetScale(newScale));
    },
    nextScale: ({ musicKey, fretChanges, instrument, scale, mode }) => {
      const newScale = MusicMan.getAdjacentScaleLabel(scale, 1);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale: newScale,
        instrument,
        mode
      });

      setCachedData({
        scale: newScale
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetScale(newScale));
    },
    prevScale: ({ musicKey, fretChanges, instrument, scale, mode }) => {
      const newScale = MusicMan.getAdjacentScaleLabel(scale, -1);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale: newScale,
        instrument,
        mode
      });

      setCachedData({
        scale: newScale
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForSetScale(newScale));
    },
    nextKey: ({ fretChanges, scale, chord, instrument, pattern, musicKey, mode }) => {
      const newMusicKey = MusicMan.getAdjacentMusicKey(musicKey, 1);
      const fretMatrix = getFretMatrix({
        musicKey: newMusicKey,
        scale,
        chord,
        instrument,
        pattern,
        mode
      });

      setCachedData({
        musicKey: newMusicKey
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewMusicKey(newMusicKey));
    },
    prevKey: ({ fretChanges, scale, chord, instrument, pattern, musicKey, mode }) => {
      const newMusicKey = MusicMan.getAdjacentMusicKey(musicKey, -1);
      const fretMatrix = getFretMatrix({
        musicKey: newMusicKey,
        scale,
        chord,
        instrument,
        pattern,
        mode
      });
      
      setCachedData({
        musicKey: newMusicKey
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewMusicKey(newMusicKey));
    },
    setKeyAndScale: ({ fretChanges, chord, instrument, mode }, musicKey, scale) => {
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        mode
      });

      setCachedData({
        musicKey: musicKey,
        scale: scale
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1,
        pattern: null,
      }, prepareForNewMusicKey(musicKey), prepareForSetScale(scale));
    },
    setChord: ({ fretChanges, musicKey, scale, instrument, keyFinderNotes, mode }, chord) => {
      console.log('-> setChord', chord);
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        keyFinderNotes,
        mode
      });
      
      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1,
        pattern: null
      }, prepareForSetChord(chord));
    },
    setInstrument: ({ fretChanges, musicKey, scale, chord, keyFinderNotes, mode }, instrument) => {
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        keyFinderNotes,
        mode
      });

      const midiInstrument = MusicMan.getInstrumentMidiId(instrument);

      setCachedData({
        instrument,
        midiInstrument
      });

      return Object.assign({ 
        fretMatrix: fretMatrix, 
        fretChanges: fretChanges+1,
        pattern: null
      }, prepareForSetInstrument(instrument, midiInstrument));
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
    flipWesternScale: ({ musicKey, scale, chord, instrument, fretChanges, keyFinderNotes, mode }) => {
      const flipped = MusicMan.getWesternFlip(musicKey, scale, mode);

      if(!flipped){
        return {};
      }else{
        const fretMatrix = getFretMatrix({
          musicKey: flipped.key,
          scale: flipped.scale,
          chord,
          instrument,
          keyFinderNotes,
          mode
        });

        return Object.assign({ 
          fretMatrix: fretMatrix, 
          fretChanges: fretChanges+1
        }, prepareForFlipWesternScale(flipped.key, flipped.scale));
      }
    },
    setPlayMode: ({}, newPlayMode) => { 
      console.log('----> set play mode', newPlayMode)
      return {
        playMode: newPlayMode 
      }
    },
    setKeyFinderMode: ({ musicKey, scale, chord, instrument, mode }, newKeyFinderMode) => {
      console.log('new mode', newKeyFinderMode)
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        mode
      });

      return {
        keyFinderNotes: [],
        keyFinderMode: newKeyFinderMode,
        fretMatrix: fretMatrix
      }
    },
    toggleNoteMode: ({ keyFinderMode }, type) => {
      const newMode = keyFinderMode === type ? 'off' : type;

      return {
        keyFinderMode: newMode
      };
    },
    setMode: ({ fretChanges, musicKey, scale, chord, instrument, pattern }, mode) => {
      console.warn('----> set setMode', mode)
      const fretMatrix = getFretMatrix({
        musicKey,
        scale,
        chord,
        instrument,
        pattern,
        mode
      });

      setCachedData({
        mode: mode
      });

      return Object.assign({
        fretMatrix, 
        fretChanges: fretChanges+1
      }, prepareForNewMode(mode))
    },
    lockMatchingKey: ({ keyFinderNotes, scale, chord, instrument, pattern, fretChanges, mode }) => {
      const foundKeys = MusicMan.matchKeysFromNotes(keyFinderNotes, scale, mode);

      const musicKey = foundKeys[0];
      if(musicKey){
        const fretMatrix = getFretMatrix({
          musicKey,
          scale,
          chord,
          instrument,
          pattern,
          mode
        });
  
        return Object.assign({ 
          keyFinderNotes: [],
          keyFinderMode: 'off',
          fretMatrix: fretMatrix, 
          fretChanges: fretChanges+1
        }, prepareForNewMusicKey(musicKey));
      }else{
        return {};
      }
    },
    setVolume: ({}, newVolume) => {
      setCachedData({
        volume: newVolume
      });
      
      return { 
        volume: newVolume
      }
    },
    changeVolume: ({ volume }, modifier) => {
      const newVolume = Tools.clamp((volume + modifier), 0, 1);
      setCachedData({
        volume: newVolume
      });

      return {
        volume: newVolume
      };
    },
    setMidiInstrument: ({ fretChanges, instrument }, newMidiInstrument) => {
      setCachedData({
        midiInstrument: newMidiInstrument
      });

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

    dispatchEasyMusicEvent: ({ musicKey, octave, scale, mode, midiInstrument }, musicEvent) => {

      if(!global.dispatchMusicEvent){
        console.error('dispatchMusicEvent method was not defined on window.');
      }else{
        if(musicEvent.notes){
          global.dispatchMusicEvent(musicEvent);
        }else{
          const octaveNote = `${musicEvent.musicKey || musicKey}-${musicEvent.octave || octave}`;
          const scaleNotes = MusicMan.getScale(octaveNote, musicEvent.scale || scale, mode);
          musicEvent.notes = MusicMan.getMidiScale(scaleNotes);

          console.log('dispatchin ', midiInstrument)
          global.dispatchMusicEvent({ 
            ...musicEvent,
            midiInstrument
          });
        }

      }
      return {};
    },

    //- TODO: this method needs A LOT OF HELP
    onFretSelected: ({ keyFinderMode, musicKey, fretChanges, playMode, scale, keyFinderNotes, instrument, midiInstrument, chord, mode }, noteObj) => {
      let results = {};
      let fretMatrix;
      let wasModified = false;
      //- just kill the pattern if its there, too tough to figure this out

      if(noteObj.isFindModifierPressed || keyFinderMode === 'find'){
        wasModified = true;
        results = Object.assign({}, results, prepareForSetFoundNote(noteObj.simpleNote, keyFinderNotes));

        //- since results changed, recalc and save fretMatrix
        fretMatrix = getFretMatrix({
          musicKey,
          scale,
          chord,
          instrument,
          keyFinderNotes: results.keyFinderNotes,
          mode
        });
        results = Object.assign({}, results, { fretMatrix: fretMatrix });
      }

      if(noteObj.isSetModifierPressed || keyFinderMode === 'set'){
        wasModified = true;
        //- perferably use altered fretmatrix
        results = Object.assign({}, results, prepareForNewMusicKey(noteObj.simpleNote));
        results = Object.assign({}, results, prepareForSetOctave(noteObj.octave));
        
        results.fretMatrix = getFretMatrix({
          musicKey: results.musicKey,
          scale,
          chord,
          instrument,
          mode
        });
      }
  
      if(playMode === 'scale'){
        triggerSound('SCALE_FULL', noteObj.octaveNote, scale, mode, midiInstrument);
      }else{
        triggerSound('NOTE', noteObj.octaveNote, scale, mode, midiInstrument);
      }

      if(wasModified){
        results.fretChanges = fretChanges+1;
        results.pattern = null;
      }
      return results;
    }
  }
};
 
export const { Provider, connect } = initStore(store);