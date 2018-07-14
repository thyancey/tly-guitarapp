import React from 'react';
import ReactDOM from 'react-dom';

import App from 'src/app';
import ErrorContainer from 'src/components/error-container';
import 'src/themes/page.less';

if(window.AudioContext || window.webkitAudioContext){
  // ReactDOM.render(<ErrorContainer activeError={{type:'webAudioNotSupported'}}/>, document.getElementById('app'));
  ReactDOM.render(<App />, document.getElementById('app'));
}else{
  ReactDOM.render(<ErrorContainer activeError={{type:'webAudioNotSupported'}}/>, document.getElementById('app'));
}


module.hot.accept();