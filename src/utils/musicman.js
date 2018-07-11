import MDATA from 'src/data/musicdata.js';
import IDATA from 'src/data/instrumentdata.js';


class MusicMan{

  static toString(){
    return '(Class MusicMan)';
  }

  static getNotes(){
    return MDATA.notes;
  }
  static getNumFrets(){
    return MDATA.numFrets;
  }
  static getScales(){
    return MDATA.scales;
  }
  static getInstruments(){
    return IDATA;
  }

  static getScaleSequence(scaleLabel){
    try{
      return MDATA.scales[scaleLabel].sequence;
    }catch(e){
      console.error(`could not find scale sequence for scale with label ${scaleLabel}`, e);
      return null;
    }
  }

  //- ex, convert 'g' to 2. -1 if none found
  static getNoteIndex(noteName){
    for(var i = 0; i < MDATA.notes.length; i++){
      if(MDATA.notes[i] === noteName){
        return i;
      }
    }
    return -1;
  }




/* More intense music stuff methods */

  //- octave is optional
  static getNoteAtIndex(noteIdx, octave){
    let calcIdx = noteIdx % MDATA.notes.length;
    if(calcIdx < 0){
      calcIdx = MDATA.notes.length + calcIdx;
    }

    let noteName = MDATA.notes[calcIdx]

    if(octave !== undefined){
      noteName = this.getNoteInOctaveFormat(noteName, noteIdx, octave);
    }

    return noteName;
  }

  static getNoteInOctaveFormat(simpleNoteName, noteIdx, curOctave){
    return `${simpleNoteName}-${this.getOctaveOffsetForNote(noteIdx, curOctave)}`;
  }

  static getOctaveOffsetForNote(noteIdx, curOctave){
    return Math.floor(noteIdx / MDATA.notes.length) + parseInt(curOctave);
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

    // console.log('getScale() from ' + rootNote + ', returning ', scale);
    return scale;
  }






  static getInstrumentChords(instrumentLabel){
    try{
      return IDATA[instrumentLabel].chords;
    }catch(e){
      console.error(`could not find chords for instrument ${instrumentLabel}`, e);
      return null;
    }
  }

  static getInstrumentStrings(instrumentLabel){
    try{
      return IDATA[instrumentLabel].strings;
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