import React, { Component } from 'react';
import { connect } from 'src/store';

require('./style.less');

class Header extends Component {

  render() {
    return(
      <header>
        <h3>{'Tom\'s Guitar App'}</h3>
        <a href="http://www.thomasyancey.com" target="_blank">{'...see some of my other stuff'}</a>

        <div className="volume-container">
          <p>{'volume'}</p>
          <input type='range' value={this.props.volume} min={0.0} max={1.0} step={0.05} onChange={e => this.props.actions.setVolume(e.target.value)} />
        </div>
      </header>
    );
  }
}

export default connect(state => ({ 
  playMode: state.playMode,
  volume: state.volume,
}))(Header);
