import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';

require('./style.less');

class ChordDisplay extends Component {

  render() {
    const chords = MusicMan.getChordDefinitions(this.props.instrument, this.props.musicKey, this.props.scale);

    return (
      <div className="active-chords">
        {chords.map((chord, index) => (
          <span key={'chord-' + index}>{chord.title}</span>
        ))}
      </div>
    );
  }

}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  instrument: state.instrument
}))(ChordDisplay);
