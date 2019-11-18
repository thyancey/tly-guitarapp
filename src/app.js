import React, { Component } from 'react';

import Main from 'src/components/main';
import Header from 'src/components/header';
import { Provider } from 'src/store';
import 'src/themes/page.less';

class App extends Component {
  render() {
    global.getStore = () => {
      return this.refs.storeDebugger && this.refs.storeDebugger.state;
    }
    return (
      <Provider ref={'storeDebugger'}>
        <Header/>
        <Main/>
      </Provider>
    );
  }
}

export default App;
