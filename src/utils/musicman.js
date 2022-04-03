import DATA_MUSIC from 'src/data/musicdata.js';
import DATA_INSTRUMENT from 'src/data/instrumentdata.js';
import DATA_MIDI from 'src/data/mididata.js';
import { Map, List } from 'immutable';


class MusicMan{

  static toString(){
    return '(Class MusicMan)';
  }

  static getNotes(){
    return DATA_MUSIC.notes;
  }
  static getNumFrets(){
    return DATA_MUSIC.numFrets;
  }
  static getScales(){
    return DATA_MUSIC.scales;
  }
  static getInstruments(){
    return DATA_INSTRUMENT;
  }
  static getMidiInstruments(){
    return DATA_MIDI.instruments;
  }
  static splitOctaveNote(octaveNote){
    const split = octaveNote.split('-');
    return {
      simpleNote: split[0],
      octave: split[1]
    }
  }

  static getModes(){
    return DATA_MUSIC.modes;
  }
  
  static getModeLabel(idx){
    return DATA_MUSIC.modes[idx] || 'ERROR';
  }

  static getPattern(patternId){
    if(!patternId) return null;

    const patternObj = DATA_MUSIC.scalePatterns.find((sp, idx) => idx == patternId.split('-')[0]);
    if(patternObj){
      return patternObj.patterns[patternId.split('-')[1]] || null;
    }

    return null;
  }

  static getPatterns(instrumentLabel, scaleLabel){
    const patterns = [];
    for(let sp = 0; sp < DATA_MUSIC.scalePatterns.length; sp++){
      const scalePattern = DATA_MUSIC.scalePatterns[sp];
      if(scalePattern.instruments.indexOf(instrumentLabel) > -1 && scalePattern.scales.indexOf(scaleLabel) > -1){
        
        return scalePattern.patterns.map((p,i) => {
          p.id = `${sp}-${i}`;
          return p;
        });
      }
    }

    return patterns;
  }

  static findPatternRanges(patternObj, strings, notes, fretBounds){
    const ranges = [];
    const foundString = strings[patternObj.refString];
    const stringFretBounds = fretBounds[patternObj.refString];

    let foundFretIndexes = [];

    for(var n = 0; n < foundString.length; n++){
      const pattern = patternObj.offsets[patternObj.refString];
      const octaveNote = foundString[n];
      const fretIdx = n + stringFretBounds[0];
      const octaveNoteObj = MusicMan.splitOctaveNote(octaveNote);

      if(octaveNoteObj.simpleNote === notes[0]){
        let minFret = fretIdx + pattern[0];
        let maxFret = fretIdx + pattern[1];

        if(minFret >= stringFretBounds[0] && maxFret <= stringFretBounds[1]){
          foundFretIndexes.push(fretIdx);
        }
      }
    }

    strings.forEach((string, stringIdx) => {
      const stringRangeArray = [];
      foundFretIndexes.forEach((fretIdx) => {
        stringRangeArray.push([
          fretIdx + patternObj.offsets[stringIdx][0],
          fretIdx + patternObj.offsets[stringIdx][1]
        ])
      })

      ranges.push(stringRangeArray);
    });

    return ranges;
  }

  static isFretIndexInPatternRanges(index, patternRanges){
    if(!patternRanges){
      return false;
    }

    let found = false;
    patternRanges.forEach(pr => {
      if(index >= pr[0] && index <= pr[1]){
        found = true;
      }
    });

    return found;
  }

  static convertToStringsMatrix(strings, notes, fretBounds, keyFinderNotes, chordFretIdxs, patternObj){
    const stringResults = [];

    const patternRanges = patternObj ? MusicMan.findPatternRanges(patternObj, strings, notes, fretBounds) : [];

    for(let i = 0; i < strings.length; i++){
      const stringPatternRanges = patternRanges[i];

      const resultObj = {
        fretBounds: fretBounds[i],
        frets: MusicMan.convertToNotesMatrix(strings[i], notes, keyFinderNotes, chordFretIdxs[i], fretBounds[i], stringPatternRanges)
      };
      stringResults.push(resultObj);
    }
    return new List(stringResults);
  }

  static convertToNotesMatrix(string, notes, keyFinderNotes, chordFret, fretBounds, patternRanges){
    // console.log('keyfinder notes: ', keyFinderNotes);
    const retNotes = [];
    for(let i = 0; i < string.length; i++){
      const octaveNote = string[i];
      const fretIdx = i + fretBounds[0];
      const octaveNoteObj = MusicMan.splitOctaveNote(octaveNote);
      const noteIdx = notes.indexOf(octaveNoteObj.simpleNote);
      const isFound = keyFinderNotes && keyFinderNotes.indexOf(octaveNoteObj.simpleNote) > -1 || false;

      retNotes.push({
        isInKey: noteIdx > -1,
        isInChord: chordFret === fretIdx,
        isInFound: isFound,
        isInPattern: MusicMan.isFretIndexInPatternRanges(fretIdx, patternRanges),
        fretIdx: fretIdx,
        noteIdx: noteIdx,
        octaveNote: octaveNote,
        octave: octaveNoteObj.octave,
        simpleNote: octaveNoteObj.simpleNote,
      });
    }

    return new List(retNotes);
  }

  static filterFretMatrixForChords(fretMatrix, chordFretIdxs){
    if(!chordFretIdxs || chordFretIdxs.length === 0){
      return fretMatrix.map(f => f);
    }

    let retVal = [];
    for(let i = 0; i < fretMatrix.size; i++){
      const chordFretIdx = chordFretIdxs[i];
      const fretList = fretMatrix.get(i).frets.map((fret, idx) => {
        if(idx === chordFretIdx){
          return Object.assign({}, fret, { isInChord: true });
        }else{
          return Object.assign({}, fret, { isInChord: false });
        }
      });

      retVal.push({
        fretBounds: fretMatrix.get(i).fretBounds,
        frets: fretList
      });
    }

    return new List(retVal);
    /*
    return fretMatrix.map((fms, stringIdx) => (fms.frets.map((fret, fretIdx) => {
      if(fretIdx === chordFretIdxs[stringIdx]){
        return Object.assign({}, fret, { isInChord: true });
      }else{
        return Object.assign({}, fret, { isInChord: false });
      }
    })));*/
  }

  static getScaleTitle(scaleLabel){
    try{
      return DATA_MUSIC.scales[scaleLabel].title
    }catch(e){
      return 'Error'
    }
  }

  static getScaleTriadType(scaleLabel){
    try{
      return DATA_MUSIC.scales[scaleLabel].triad;
    }catch(e){
      console.error(`could not find scale triad for scale with label ${scaleLabel}`, e);
      return null;
    }
  }

  static getScaleSequence(scaleLabel){
    try{
      return DATA_MUSIC.scales[scaleLabel].sequence;
    }catch(e){
      console.error(`could not find scale sequence for scale with label ${scaleLabel}`, e);
      return null;
    }
  }
  
  static getScaleRegion(scaleLabel){
    try{
      return DATA_MUSIC.scales[scaleLabel].region;
    }catch(e){
      console.error(`could not find scale region for scale with label ${scaleLabel}`, e);
      return null;
    }
  }

  //- ex, convert 'g' to 2. -1 if none found
  static getNoteIndex(noteName){
    return DATA_MUSIC.notes.findIndex(note => note === noteName);
  }

  static getAdjacentScaleLabel(curScaleLabel, modifier){
    const scaleKeys = Object.keys(DATA_MUSIC.scales);
    const newIdx = scaleKeys.findIndex(s => s === curScaleLabel) + modifier;
     
    if(newIdx >= scaleKeys.length){
      return scaleKeys[0];
    }else if(newIdx < 0){
      return scaleKeys[scaleKeys.length - 1];
    }else{
      return scaleKeys[newIdx];
    }
  }

  static getAdjacentMusicKey(curMusicKey, modifier){
    const newIdx = DATA_MUSIC.notes.findIndex(n => n === curMusicKey) + modifier;

    if(newIdx >= DATA_MUSIC.notes.length){
      return DATA_MUSIC.notes[0];
    }else if(newIdx < 0){
      return DATA_MUSIC.notes[DATA_MUSIC.notes.length - 1];
    }else{
      return DATA_MUSIC.notes[newIdx];
    }
  }

/* More intense music stuff methods */

  /* major and minor scales are related, this is for helping with quick switching between the two */
  static getWesternFlip(key, scaleLabel, mode){
    const flippedScaleObj = DATA_MUSIC.westernScaleFlips[scaleLabel];
    if(!flippedScaleObj){
      return null;
    }else{
      const oldScale = this.getScale(key, scaleLabel, mode);
      const noteIdx = oldScale.indexOf(key);

      let flippedKeyIdx = noteIdx + flippedScaleObj.diff;
      if(flippedKeyIdx < 0){
        flippedKeyIdx = oldScale.length - 1 + flippedKeyIdx;
      }else if(flippedKeyIdx > oldScale.length - 1){
        flippedKeyIdx = flippedKeyIdx - (oldScale.length - 1);
      }

      return {
        key: oldScale[flippedKeyIdx],
        scale: flippedScaleObj.scale
      };
    }
  }

  //- from a list of notes, and a scale, find any matching keys
  //- discard any scales that dont contain a note in your set
  static matchKeysFromNotes(notesToMatch, scaleLabel, mode){
    let foundKeys = [];
    if(notesToMatch.length === 0){
      return foundKeys;
    }

    for(let n = 0; n < DATA_MUSIC.notes.length; n++){
      //- one note at a time
      let scale = this.getScale(DATA_MUSIC.notes[n], scaleLabel, mode);

      let foundNotes = notesToMatch.filter(note => scale.indexOf(note) > -1);
      if(foundNotes.length === notesToMatch.length){
        foundKeys.push(DATA_MUSIC.notes[n]);
      }
    }

    return foundKeys;
  }

  /* based on an array of notes, find any scales and keys that contain those values */
  static predictScalesFromNotes(notesToMatch, scaleLabel, mode){
    let foundObjs = [];
    if(notesToMatch.length === 0){
      return [];
    }

    for(let referenceScale in DATA_MUSIC.scales){
      //- for each scale, check each note
      if(DATA_MUSIC.scales[referenceScale].type !== 'scale'){
        continue;
      }
      
      for(let n = 0; n < DATA_MUSIC.notes.length; n++){
        //- one note at a time
        let scaleNotes = this.getScale(DATA_MUSIC.notes[n], referenceScale, mode);
        //- now that you have notes in the scale, make sure notesToMatch doesnt have any weirdos
        let foundNotes = notesToMatch.filter(note => scaleNotes.indexOf(note) > -1);

        if(foundNotes.length === notesToMatch.length){
          foundObjs.push({
            key: DATA_MUSIC.notes[n],
            scale: referenceScale,
            isCurrent: referenceScale === scaleLabel
          });
        }
      }
    }

    return foundObjs;
  }

  /* based on an array of notes, find any scales and keys that contain a full set of those values */
  static filterScalesFromNotes(notesToMatch, scaleLabel, mode){
    let foundObjs = [];
    if(notesToMatch.length === 0){
      return [];
    }

    for(let referenceScale in DATA_MUSIC.scales){
      //- for each scale, check in each key for notes that were given
      //- if a scale contains ALL notes in notesToMatch, return it
      if(DATA_MUSIC.scales[referenceScale].type !== 'scale'){
        continue;
      }
      for(let n = 0; n < DATA_MUSIC.notes.length; n++){
        //- one note at a time
        const referenceKey = DATA_MUSIC.notes[n];
        let foundNotes = this.getScale(referenceKey, referenceScale, mode);

        if(foundNotes.length - 1 > notesToMatch.length){
          //- if more notes than given, the referenceScale is not contained within, quit
          //- -1 is because foundNodes repeat both start and end note (ex, A, B, C, D, A )
        }else{
          const filtered = foundNotes.filter((k,i) => notesToMatch.indexOf(k) === -1);
          if(filtered.length === 0){
            //- referenceScale is contained in notesToMatch, so its a match!
            foundObjs.push({
              key: referenceKey,
              scale: referenceScale,
              isCurrent: referenceScale === scaleLabel
            });
          }
        }
      }
    }

    return foundObjs;
  }

  //- octave is optional
  static getNoteAtIndex(noteIdx, octave){
    let calcIdx = noteIdx % DATA_MUSIC.notes.length;
    if(calcIdx < 0){
      calcIdx = DATA_MUSIC.notes.length + calcIdx;
    }

    let noteName = DATA_MUSIC.notes[calcIdx]

    if(octave !== null){
      noteName = this.getNoteInOctaveFormat(noteName, noteIdx, octave);
    }

    return noteName;
  }

  static getNoteInOctaveFormat(simpleNoteName, noteIdx, curOctave){
    return `${simpleNoteName}-${this.getOctaveOffsetForNote(noteIdx, curOctave)}`;
  }

  static getOctaveOffsetForNote(noteIdx, curOctave){
    return Math.floor(noteIdx / DATA_MUSIC.notes.length) + parseInt(curOctave);
  }


  /* 
    returns scale sequence, adding to the end a note which is an octave above (+12) the first note
    // ([ 0, 2, 4 ]) => [ 0, 2, 4, 12] 

    also shifts if youre using a mode
    // ([ 0, 2, 4 ], 1) => [ 2, 4, 12, 14 ] 
  */
  static getCompleteSequence(sequence, mode){
    const shifted = this.shiftArray(sequence, mode);
    return [ ...shifted, shifted[0] + 12 ];
  }

  /* returns a full scale based on an octave note and a label (major)
    //- ex, ("C-", "major") returns
    //- C, D, E, F, G, A, B, C

    //- ("C-2", "major") returns 
    //- C-2, D-2, E-2, F-2, G-2, A-3, B-3, C-3
  */
  static getScale(octaveNote, scaleLabel, mode){
    // console.log('getScale', octaveNote, scaleLabel, mode);
    if(octaveNote.indexOf('-') === -1){
      octaveNote += '-';
    }
    const note = octaveNote.split('-')[0];
    const octave = octaveNote.split('-')[1] || null;

    const sequence = MusicMan.getScaleSequence(scaleLabel);
    const shiftedSequence = MusicMan.getCompleteSequence(sequence, mode);
    let scale = [];

    let curIdx = MusicMan.getNoteIndex(note);
    for(var i = 0; i < shiftedSequence.length; i++){
      //- it's ok to pass octave here as null if this was called without an octave note
      scale.push(MusicMan.getNoteAtIndex(curIdx + shiftedSequence[i], octave));
    }
    return scale;
  }

  static shiftArray(array, amount = 0){
    return array.map((_, idx) => {
      const offsetIdx = Math.abs((idx + amount) % array.length);
      return array[offsetIdx];
    });
  }

  static getInstrumentMidiId(instrumentLabel){
    try{
      return DATA_INSTRUMENT[instrumentLabel].midiId;
    }catch(e){
      console.error(`could not find midiId for instrument ${instrumentLabel}`, e);
      return null;
    }
  }

  static getInstrumentChords(instrumentLabel){
    try{
      return DATA_INSTRUMENT[instrumentLabel].chords;
    }catch(e){
      console.error(`could not find chords for instrument ${instrumentLabel}`, e);
      return null;
    }
  }

  static getInstrumentStrings(instrumentLabel){
    try{
      return DATA_INSTRUMENT[instrumentLabel].strings;
    }catch(e){
      console.error(`could not find strings for instrument ${instrumentLabel}`, e);
      return null;
    }
  }
  
  static getInstrumentNumFrets(instrumentLabel){
    try{
      let maxFrets = 0;
      const instrumentStrings = DATA_INSTRUMENT[instrumentLabel].strings;
      for(let i = 0; i < instrumentStrings.length; i++){
        if(instrumentStrings[i].frets && instrumentStrings[i].frets[1] > maxFrets){
          maxFrets = instrumentStrings[i].frets[1];
        }
      }
      return maxFrets;
    }catch(e){
      console.error(`could not find num frets for instrument ${instrumentLabel}`, e);
      return 0;
    }
  }

  static getInstrumentNotesFromLabel(instrumentLabel){
    const instrumentStrings = MusicMan.getInstrumentStrings(instrumentLabel);
    return {
      'strings': MusicMan.getInstrumentNotes(instrumentStrings),
      'fretBounds': MusicMan.getFretBoundsArray(instrumentStrings)
    }
  }

  static getInstrumentNotes(instrumentStrings){
    // console.log('getInstrumentNotes', instrumentStrings);
    const retStrings = [];
    for(var s = 0; s < instrumentStrings.length; s++){
      let stringNotes = [];
      // console.log('instrumentStrings! ', instrumentStrings)
      const octaveNote = instrumentStrings[s].note;
      let noteIdx = MusicMan.getNoteIndex(octaveNote.split('-')[0]);
      let octave = octaveNote.split('-')[1];

      //- +1 for the 'nut'
      const numFrets = instrumentStrings[s].frets[1] - instrumentStrings[s].frets[0] + 1;

      for(var f = 0; f < numFrets; f++){
        //- pushes something like 20, 1
        stringNotes.push(MusicMan.getNoteAtIndex(noteIdx + f, octave));
      }
      //- pushes all notes in a string
      retStrings.push(stringNotes);
    }

    //- return array of strings, each with array of notes
    return retStrings;
  }

  static getFretBoundsArray(instrumentStrings){
    const retFrets = [];

    for(var s = 0; s < instrumentStrings.length; s++){
      retFrets.push(instrumentStrings[s].frets);
    }

    return retFrets;
  }



  static getChordFretIdxs(chordLabel, instrumentLabel){
    const chordObj = MusicMan.getChordObj(chordLabel, instrumentLabel);
    if(!chordObj){
      return [];
    }

    return chordObj.fingering;
  }

  static getChordObj(chordLabel, instrumentLabel){
    const chordsObj = MusicMan.getInstrumentChords(instrumentLabel);
    if(!chordsObj){
      return null;
    }

    const chordObj = chordsObj[chordLabel];
    if(!chordObj){
      return null;
    }

    return chordObj;
  }

  static getNoteChange(oldOctaveNote, newOctaveNote){
    const oldIdx = MusicMan.getNoteIndex(oldOctaveNote.split('-')[0]);
    const oldOctave = oldOctaveNote.split('-')[1];
    const newIdx = MusicMan.getNoteIndex(newOctaveNote.split('-')[0]);
    const newOctave = newOctaveNote.split('-')[1];

    const octaveChange = (newOctave - oldOctave) * 12;
    const idxChange = newIdx - oldIdx;
    const noteChange = octaveChange + idxChange;

    return noteChange;
  }


  static getChordDefinitions(instrumentLabel, musicKey, scaleLabel, mode){
    const chords = MusicMan.getInstrumentChords(instrumentLabel) || [];

    if(musicKey && scaleLabel){
      //- get chords for key and scale
      return(MusicMan.getScaleChords(chords, musicKey, scaleLabel, mode));
    }else{
      const retChords = [];
      for(var key in chords){
        retChords.push(chords[key]);
      } 

      return retChords;
    }
  }

  static getShiftedTriads(triadArray, mode){
    const shifted = MusicMan.shiftArray(triadArray, mode);
    return [ ...shifted, shifted[0] ];
  }

  static getScaleChords(chords, musicKey, scaleLabel, mode){
    const scaleChords = [];

    const triadType = MusicMan.getScaleTriadType(scaleLabel);
      //- TODO if no triadType found, just give up, I dunno how to do this
    if(!triadType){
      return [];
    }

    //- will get something like ["major", "minor", "minor", "etc"]
    const triadLabels = DATA_MUSIC.scaleTriads[triadType];
    if(!triadLabels){
      return [];
    }

    const shiftedTriadLabels = MusicMan.getShiftedTriads(triadLabels, mode);

    const scaleNotes = MusicMan.getScale(musicKey, scaleLabel, mode);
    if(!scaleNotes){
      return [];
    }

    // console.log("scaleNotes!", scaleNotes);

    let triadIdx = 0;

    const retChords = [];
    for(var i = 0; i < scaleNotes.length; i++){
      // console.log('-----------------------');
      // console.log('now checking: ' + scaleNotes[i]);
      let found = false;
      //- looping through [C, D, E, F, ...]
      for(var chordLabel in chords){
        if(chords.hasOwnProperty(chordLabel)){
        //- looping through [C, C-m, C-dim, D, D-m, D-dim, ...]

          if(chords[chordLabel].root === scaleNotes[i]){
            //- matched [C] with [C, C-m, C-dim] now check triad
            // console.log('(root) found ' + chordLabel + ' for ' + scaleNotes[i]);

            // console.log('triad checking: ' + chords[chordLabel].triad + ' and ' + triadLabels[triadIdx]);
            if(chords[chordLabel].triad !== undefined && chords[chordLabel].triad === shiftedTriadLabels[triadIdx]){
              // console.log('(triad) found ' + chords[chordLabel].triad + ' for ' + shiftedTriadLabels[triadIdx]);
              let chordObj = chords[chordLabel];
              chordObj.id = chordObj.id || chordLabel;
              // console.log('puhsin', chordLabel)
              scaleChords.push(chords[chordLabel]);
              triadIdx++;
              found = true;
              break;
            }
          }
        }
      }


      if(!found){
        //- found nothing, so return crap
        scaleChords.push(
          {
            "title": scaleNotes[i] + this.getReadableTriad(shiftedTriadLabels[triadIdx]),
            "root": scaleNotes[i],
            "triad": null,
            "fingering": null,
            "disabled":true
          }
        );
        triadIdx++;
      }
    }


    // console.log(scaleChords);


    return scaleChords;
  }

  static getReadableTriad(triadLabel){
    switch(triadLabel){
      case 'major': return ''
        break;
      case 'minor': return 'm'
        break;
      case 'diminished': return 'dim'
        break;
      default: return triadLabel
    }
  }

  static getChordNotes(chordLabel, tuningLabel){
    const retNotes = [];

    const chordObj = MusicMan.getChordObj(chordLabel, tuningLabel);
    if(!chordObj){
      return retNotes;
    }

    // const chordObj = MusicMan.getNestedMusicObject('chords', chordLabel);
    const strings = MusicMan.getInstrumentNotesFromLabel(tuningLabel).strings;

    for(var sn = 0; sn < chordObj.fingering.length; sn++){
      const fingerIdx = chordObj.fingering[sn];
      if(fingerIdx > -1){
        retNotes.push(strings[sn][fingerIdx]);
      }
    }

    return retNotes;
  }

/* MIDI STUFF */
  static getMidiNote(octaveNote){
    // console.log('getMidiNote(' + octaveNote + ')');
    // console.log('and ', MusicMan.getNoteChange('C-2', octaveNote));
    return MusicMan.getNoteChange('C-2', octaveNote) + 48;
  }

  static getMidiScale(scaleNotes, descend){
    const midiNotes = [];
    for(let i = 0; i < scaleNotes.length; i++){
      midiNotes.push(MusicMan.getMidiNote(scaleNotes[i]));
    }
    if(descend){
      let len = midiNotes.length;
      for(let d = len - 2; d >= 0; d--){
        midiNotes.push(midiNotes[d]);
      }
    }

    return midiNotes;
  }

  static getMidiChord(scaleNotes){
    const midiNotes = [];
    for(let i = 0; i < scaleNotes.length; i++){
      midiNotes.push(MusicMan.getMidiNote(scaleNotes[i]));
    }

    return midiNotes;
  }
  
}

export default MusicMan;