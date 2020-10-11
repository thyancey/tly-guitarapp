
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
  'Slash':{
    action: 'flipWesternScale'
  }
}

const InputManager = {
  create: (document, commandCallback) => {
    if(!_commandCallback){
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