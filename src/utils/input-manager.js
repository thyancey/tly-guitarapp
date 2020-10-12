require('web-midi-api');

const _data = [];
let _commandCallback = null;

const _keyMap = {
  'BracketLeft': {
    action: 'prevKey'
  },
  'BracketRight': {
    action: 'nextKey'
  },
  'Comma': {
    action: 'prevScale'
  },
  'Period': {
    action: 'nextScale'
  },
  'Quote': {
    action: 'toggleNoteMode',
    payload: 'find'
  },
  'Semicolon': {
    action: 'toggleNoteMode',
    payload: 'set'
  },
  'KeyL': {
    action: 'lockMatchingKey'
  },
  'KeyO': {
    action: 'changeVolume',
    payload: -.1
  },
  'KeyP': {
    action: 'changeVolume',
    payload: .1
  },
  'Slash':{
    action: 'flipWesternScale'
  }
}

const InputManager = {
  create: (document, commandCallback) => {
    if(!_commandCallback){
      try{
        InputManager.rawMidiSetup();
      }catch(e){
        console.error('midi error', e);
      }
  
      _commandCallback = commandCallback;
      document.addEventListener('keydown', InputManager.onKeyDown.bind(this));
    }
  },

  rawMidiSetup: () => {
    if (!navigator.requestMIDIAccess) {
      console.warn('WebMIDI is not supported in this browser.');
      return;
    }

    navigator.requestMIDIAccess().then(midiAccess => {
      console.log('This browser supports WebMIDI!');
      console.log(midiAccess);

      // var inputs = midiAccess.inputs;
      // var outputs = midiAccess.outputs;

      console.log('inputs:', midiAccess.inputs)
      console.log('inputValues:', midiAccess.inputs.values())

      for (var input of midiAccess.inputs.values()){
        console.log('lookin at input...', input);
        input.onmidimessage = InputManager.onMidiMessage;
      }

    }, (e) => {
      console.warn('Could not find any MIDI input');
    });
  },

  onMidiMessage(midiMessage){
    // console.log('onMidiMessage', midiMessage)
    const command = midiMessage.data[0];
    const note = midiMessage.data[1];
    const velocity = (midiMessage.data.length > 2) ? midiMessage.data[2] : 0; // a velocity value might not be included with a noteOff command

    switch (command) {
      case 144: // noteOn
        if (velocity > 0) {
          // console.log('NOTE ON', note, velocity);
          // console.log(midiMessage);
          _commandCallback({
            action: 'setNoteFromMidi', 
            payload: note
          });
        } else {
          // console.log('NOTE QUIET', note, velocity);
          // noteOff(note);
          _commandCallback({
            action: 'removeNoteFromMidi', 
            payload: note
          });
        }
        break;
      case 128: // noteOff
        // console.log('NOTE OFF', note, velocity);
        // noteOff(note);
          _commandCallback({
            action: 'removeNoteFromMidi', 
            payload: note
          });
        break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
  },

  onKeyDown: e => { 
    console.log('key:', e.code);
    if(_keyMap[e.code]){
      _commandCallback(_keyMap[e.code]);
    }

    return;
  },
  add: item => _data.push(item),
  get: id => _data.find(d => d.id === id)
}

Object.freeze(InputManager);
export default InputManager;