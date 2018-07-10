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

  /* returns a full scale based on a root note (c), a label (major), and an (optional) octave (2)
    //- ex, C with major scale, and no octave returns
    //- C, D, E, F, G, A, B, C

    //- C with major scale and octave 2 gives
    //- C-2, D-2, E-2, F-2, G-2, A-3, B-3, C-3
  */
  static getScale(rootNote, scaleLabel, octave){
    const sequence = this.getScaleSequence(scaleLabel);
    let scale = [];

    let curIdx = MusicMan.getNoteIndex(rootNote);
    for(var i = 0; i < sequence.length; i++){
      scale.push(MusicMan.getNoteAtIndex(curIdx + sequence[i], octave));
    }

    return scale;
  }






  static getInstrumentChords(instrumentLabel){
    try{
      return IDATA[instrumentLabel].chords;
    }catch(e){
      console.error(`could not find chords for tuning ${instrumentLabel}`, e);
      return null;
    }
  }

  static getInstrumentStrings(instrumentLabel){
    try{
      return IDATA[instrumentLabel].strings;
    }catch(e){
      console.error(`could not find strings for tuning ${instrumentLabel}`, e);
      return null;
    }
  }

  static getInstrumentNotesFromLabel(instrumentLabel){
    const tuningStringsArray = MusicMan.getInstrumentStrings(instrumentLabel);
    // console.log('1');
    // console.log(tuningStringsArray);
    return {
      'strings': MusicMan.getInstrumentNotes(tuningStringsArray),
      'fretBounds': MusicMan.getFretBoundsArray(tuningStringsArray)
    }
  }

  static getInstrumentNotes(tuningStringsArray){
    // console.log('getInstrumentNotes', tuningStringsArray);
    const retStrings = [];
    for(var s = 0; s < tuningStringsArray.length; s++){
      let stringNotes = [];
      // console.log('tuningStringsArray! ', tuningStringsArray)
      const octaveNote = tuningStringsArray[s].note;
      let noteIdx = MusicMan.getNoteIndex(octaveNote.split('-')[0]);
      let octave = octaveNote.split('-')[1];

      //- +1 for the 'nut'
      const numFrets = tuningStringsArray[s].frets[1] - tuningStringsArray[s].frets[0] + 1;

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

  static getFretBoundsArray(tuningStringsArray){
    const retFrets = [];

    for(var s = 0; s < tuningStringsArray.length; s++){
      retFrets.push(tuningStringsArray[s].frets);
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

}

export default MusicMan;