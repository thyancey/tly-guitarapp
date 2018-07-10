import MDATA from 'src/data/musicdata.json';

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
  static getTuning(){
    return MDATA.tuning;
  }

  static getScaleSequence(scaleLabel){
    try{
      return MDATA.scales[scaleLabel].sequence;
    }catch(e){
      console.error(`could not find scale with label ${scaleLabel}`, e);
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
      curIdx += sequence[i];
    }

    return scale;
  }

}

export default MusicMan;