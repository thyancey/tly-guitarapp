import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import ComboButton from 'src/components/shared/combo-button';

require('./style.less');

class ToolsPanel extends Component {
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
    this.props.actions.flipWesternScale();
  }

  render() {
    const foundKeys = MusicMan.matchKeysFromNotes(this.props.keyFinderNotes, this.props.scale);
    const flipEnabled = this.props.scale.indexOf('major') > -1 || this.props.scale.indexOf('minor') > -1;
    
    return (
      <div>
        <div className="selection-buttons">
          <ComboButton  
            onClickMethod={() => this.onToggleKeyMode('off')}
            isActive={this.props.keyFinderMode === 'off'}
            icon="icon-tools-playnote" 
            title="Play Note" />
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
            onClickMethod={() => flipEnabled && this.flipScale()}
            isDisabled={!flipEnabled}
            isActive={false}
            icon="icon-reset" 
            title="Flip Triad" />
        </div>
        <div className="found-keys">
          <h2>{`Matching keys`}</h2>
          <span className="found-keys-scalelabel">{`${MusicMan.getScaleTitle(this.props.scale)}`}</span><span>{'scales only'}</span>
          <div className="key-list">
            {foundKeys.map((note, index) => (
              <span key={'note-' + index} className={ note === this.props.musicKey ? 'active' : null } onClick={() => this.onSetKey(note)}>{note}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({ 
  playMode: state.playMode,
  keyFinderMode: state.keyFinderMode,
  keyFinderNotes: state.keyFinderNotes,
  musicKey: state.musicKey,
  scale: state.scale
}))(ToolsPanel);
