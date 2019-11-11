import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class MusicKeyPanel extends Component {
  onMusicKeyClick(musicKey){
    this.props.actions.setMusicKey(musicKey);
    
    if(this.props.playScales){
      global.setTimeout(() => {
        this.props.actions.dispatchEasyMusicEvent({
          type: 'SCALE_FULL'
        });
      }, 0);
    }
  }

  createNoteButtons(){
    return MusicMan.getNotes().map((note, index) => (
            <StoreButton  actionMethod={(param) => this.onMusicKeyClick(param)} 
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
  musicKey: state.musicKey,
  playScales: state.selectionMode.scaleMode
}))(MusicKeyPanel);
