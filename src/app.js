import React, { Component } from 'react';

import Main from 'src/components/main';
import { Provider } from 'src/store';

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
