import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';

require('./style.less');

class NoteDisplayPanel extends Component {

  render() {
    const simpleNotes = MusicMan.getScale(this.props.musicKey, this.props.scale);

    return (
      <div>
        <div className="active-notes">
          {simpleNotes.map((note, index) => 
            <span key={'note-' + index}>{note}</span>
          )}
        </div>
      </div>
    );
  }

}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale
}))(NoteDisplayPanel);
