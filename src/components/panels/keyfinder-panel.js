import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import ComboButton from 'src/components/shared/combo-button';

require('./style.less');

class KeyFinderPanel extends Component {
  constructor(){
    super();

    this.state = {
      storedNotes: []
    };
  }

  onToggleKeyMode(toggleType){
    let keyFinderMode = this.props.keyFinderMode !== toggleType ? toggleType : 'off';

    this.props.actions.setKeyFinderMode(keyFinderMode);
  }

  onSetKey(note){
    this.props.actions.setKeyFinderMode('off');
    this.props.actions.setMusicKey(note);
  }

  flipScale(){
    this.props.actions.flipMajMinScale();
  }

  render() {
    const foundKeys = MusicMan.matchKeysFromNotes(this.props.keyFinderNotes, this.props.scale);
    return (
      <div>
        <div className="selection-buttons">
          <ComboButton  
            onClickMethod={() => this.onToggleKeyMode('set')}
            isActive={this.props.keyFinderMode === 'set'}
            icon="icon-editnote" 
            title="Set Key" />
          <ComboButton  
            onClickMethod={() => this.onToggleKeyMode('find')}
            isActive={this.props.keyFinderMode === 'find'}
            icon="icon-editnote" 
            title="Find Key" />
          <ComboButton  
            onClickMethod={() => this.flipScale()}
            isDisabled={this.props.scale.indexOf('major') > -1 || this.props.scale.indexOf('minor') > -1}
            isActive={false}
            icon="icon-editnote" 
            title="Flip Maj/Min" />
        </div>
        <p>{`${MusicMan.getScaleTitle(this.props.scale)}`}</p>
        <div className="found-keys">
          {foundKeys.map((note, index) => (
            <span key={'note-' + index} className={ note === this.props.musicKey ? 'active' : null } onClick={() => this.onSetKey(note)}>{note}</span>
          ))}
        </div>
      </div>
    );
  }

}

export default connect(state => ({ 
  selectionMode: state.selectionMode,
  keyFinderMode: state.keyFinderMode,
  keyFinderNotes: state.keyFinderNotes,
  musicKey: state.musicKey,
  scale: state.scale
}))(KeyFinderPanel);
