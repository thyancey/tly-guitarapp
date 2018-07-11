import MusicMan from './musicman';

class MusicBox{
  constructor(instrumentId) {
    this.id = instrumentId;
    console.log(`music box "${this.id}" is ready!`);
  }

  playNote(note){
    console.log('MusicBox.playNote(' + note + ')');
  }

  playNotes(notes){
    console.log('MusicBox.playNotes()', notes);
  }

  playChord(notes){
    console.log('MusicBox.playChord()', notes);
  }

  playMidiNote(octaveNote){
    this.playNote(MusicMan.getMidiNote(octaveNote));
  }

  playMidiScale(scaleNotes, descend){
    const midiNotes = [];
    for(var i = 0; i < scaleNotes.length; i++){
      midiNotes.push(MusicMan.getMidiNote(scaleNotes[i]));
    }
    if(descend){
      let len = midiNotes.length;
      for(var d = len - 2; d >= 0; d--){
        midiNotes.push(midiNotes[d]);
      }
    }
    this.playNotes(midiNotes);
  }

  playMidiChord(scaleNotes){
    const midiNotes = [];
    for(var i = 0; i < scaleNotes.length; i++){
      midiNotes.push(MusicMan.getMidiNote(scaleNotes[i]));
    }
    this.playChord(midiNotes);
  }
}

export default MusicBox;