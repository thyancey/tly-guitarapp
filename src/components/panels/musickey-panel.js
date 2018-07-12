import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class MusicKeyPanel extends Component {
  createNoteButtons(){
    return MusicMan.getNotes().map((note, index) => (
            <StoreButton  actionMethod={this.props.actions.setMusicKey} 
                          actionParam={note} 
                          isActive={(note === this.props.musicKey)} 
                          title={note}
                          key={'key-' + index}/>
    ));
  }

  render() {
    return (
      <div>
        {this.createNoteButtons()}
      </div>
    );
  }

}

export default connect(state => ({ 
  musicKey: state.musicKey
}))(MusicKeyPanel);
