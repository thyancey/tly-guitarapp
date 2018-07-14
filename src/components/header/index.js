import React, { Component } from 'react';

require('./style.less');

export default class Header extends Component {

  render() {
    return(
      <header>
        <h3>{'Tom\'s Guitar App'}</h3>
        <a href="http://www.thomasyancey.com" target="_blank">{'...see some of my other stuff'}</a>
      </header>
    );
  }

}
