import WebMidi from 'webmidi';

const _data = [];
let _commandCallback = null;
let _midiInput = null;

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
  'Slash':{
    action: 'flipWesternScale'
  }
}

const InputManager = {
  create: (document, commandCallback) => {
    if(!_commandCallback){
      
      WebMidi.enable(err => {
        console.warn('WEB MIDID')
        console.log(WebMidi.inputs);
        console.log(WebMidi.outputs);
        
        _midiInput = WebMidi.getInputById('input-0');
        _midiInput.addListener('noteon', 'all', event => {
          if(event.rawVelocity > 100){
            console.log(`note value`, event);
            // console.log(`note value`, event.note);
            // {number: 40, name: "E", octave: 2}
            // { name: simpleNote, octave: octave - 1}
            commandCallback({
              action: 'setNoteFromMidi', 
              payload: event.note
            });

          }
        });
      });
      

      _commandCallback = commandCallback;
      document.addEventListener('keydown', InputManager.onKeyDown.bind(this));
    }



  },
  onKeyDown: e => { 
    // console.log('key:', e.code);
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