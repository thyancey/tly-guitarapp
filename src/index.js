import React from 'react';
import ReactDOM from 'react-dom';

import App from 'src/app';
import 'src/themes/page.less';

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();