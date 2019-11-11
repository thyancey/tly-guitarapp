import DATA_MUSIC from 'src/data/musicdata.js';
import DATA_INSTRUMENT from 'src/data/instrumentdata.js';
import DATA_MIDI from 'src/data/mididata.js';


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

  //- ex, convert 'g' to 2. -1 if none found
  static getNoteIndex(noteName){
    for(var i = 0; i < DATA_MUSIC.notes.length; i++){
      if(DATA_MUSIC.notes[i] === noteName){
        return i;
      }
    }
    return -1;
  }




/* More intense music stuff methods */

  /* major and minor scales are related, this is for helping with quick switching between the two */
  static getMajorMinorFlip(key, scaleLabel){
    const flippedScaleLabel = DATA_MUSIC.majorMinorFlips[scaleLabel];
    const noteDiff = flippedScaleLabel.indexOf('minor') > -1 ? -2 : 2;
    const oldScale = this.getScale(key, scaleLabel);
    const noteIdx = oldScale.indexOf(key);

    let flippedKeyIdx = noteIdx + noteDiff;
    if(flippedKeyIdx < 0){
      flippedKeyIdx = oldScale.length - 1 + flippedKeyIdx;
    }else if(flippedKeyIdx > oldScale.length - 1){
      flippedKeyIdx = flippedKeyIdx - (oldScale.length - 1)
    }
    const flippedKeyLabel = oldScale[flippedKeyIdx];

    return {
      key: flippedKeyLabel,
      scale: flippedScaleLabel
    };
  }

  //- from a list of notes, and a scale, find any matching keys
  static matchKeysFromNotes(notesToMatch, scaleLabel){
    let foundKeys = [];
    if(notesToMatch.size === 0){
      return foundKeys;
    }

    for(let n = 0; n < DATA_MUSIC.notes.length; n++){
      //- one note at a time
      let scale = this.getScale(DATA_MUSIC.notes[n], scaleLabel);

      let foundNotes = notesToMatch.filter(note => scale.indexOf(note) > -1);
      if(foundNotes.size === notesToMatch.size){
        foundKeys.push(DATA_MUSIC.notes[n]);
      }
    }

    return foundKeys;
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

  /* returns a full scale based on an octave note and a label (major)
    //- ex, ("C-", "major") returns
    //- C, D, E, F, G, A, B, C

    //- ("C-2", "major") returns 
    //- C-2, D-2, E-2, F-2, G-2, A-3, B-3, C-3
  */
  static getScale(octaveNote, scaleLabel){
    if(octaveNote.indexOf('-') === -1){
      octaveNote += '-';
    }
    const note = octaveNote.split('-')[0];
    const octave = octaveNote.split('-')[1] || null;

    const sequence = this.getScaleSequence(scaleLabel);
    let scale = [];

    let curIdx = MusicMan.getNoteIndex(note);
    for(var i = 0; i < sequence.length; i++){
      //- it's ok to pass octave here as null if this was called without an octave note
      scale.push(MusicMan.getNoteAtIndex(curIdx + sequence[i], octave));
    }
    
    return scale;
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

  static getInstrumentNotesFromLabel(instrumentLabel){
    const instrumentStrings = MusicMan.getInstrumentStrings(instrumentLabel);
    // console.log('1');
    // console.log(instrumentStrings);
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


  static getChordDefinitions(instrumentLabel, musicKey, scaleLabel){
    const chords = MusicMan.getInstrumentChords(instrumentLabel) || [];

    if(musicKey && scaleLabel){
      //- get chords for key and scale
      return(MusicMan.getScaleChords(chords, musicKey, scaleLabel));
    }else{
      const retChords = [];
      for(var key in chords){
        retChords.push(chords[key]);
      } 

      return retChords;
    }
  }

  static getScaleChords(chords, musicKey, scaleLabel){
    // console.log('getScaleChords')
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

    const scaleNotes = MusicMan.getScale(musicKey, scaleLabel);
    if(!scaleNotes){
      return [];
    }

    // console.log(scaleNotes);

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
            if(chords[chordLabel].triad !== undefined && chords[chordLabel].triad === triadLabels[triadIdx]){
              // console.log('(triad) found ' + chords[chordLabel].triad + ' for ' + triadLabels[triadIdx]);
              let chordObj = chords[chordLabel];
              chordObj.id = chordObj.id || chordLabel;
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
            "title": scaleNotes[i] + this.getReadableTriad(triadLabels[triadIdx]),
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