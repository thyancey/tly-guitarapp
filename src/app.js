import React, { Component } from 'react';

import Main from 'src/components/main';
import Header from 'src/components/header';
import { Provider } from 'src/store';
import 'src/themes/page.less';

class App extends Component {
  render() {
    return (
      <Provider>
        <Header/>
        <Main/>
      </Provider>
    );
  }
}

export default App;
