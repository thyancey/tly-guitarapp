import React, { Component } from 'react';

import Main from './components/main';

import { Provider } from './store';

class App extends Component {
  render() {
    return (
      <Provider>
        <Main />
      </Provider>
    );
  }
}

export default App;
