import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';

require('./style.less');

class NoteDisplayPanel extends Component {

  render() {
    const simpleNotes = MusicMan.getScale(this.props.musicKey, this.props.scale, this.props.mode);

    return (
      <div className="active-notes">
        {simpleNotes.map((note, index) => (
          <span key={'note-' + index}>{note}</span>
        ))}
      </div>
    );
  }

}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  mode: state.mode
}))(NoteDisplayPanel);
