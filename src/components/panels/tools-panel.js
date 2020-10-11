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

  onSetScaleKey(musicKey, scaleLabel){
    this.props.actions.setKeyFinderMode('off');
    this.props.actions.setKeyAndScale(musicKey, scaleLabel);
  }

  onSetKey(musicKey){
    this.props.actions.setKeyFinderMode('off');
    this.props.actions.setMusicKey(musicKey);
  }

  flipScale(){
    this.props.actions.flipWesternScale();
  }

  render() {
    const foundKeys = MusicMan.matchKeysFromNotes(this.props.keyFinderNotes, this.props.scale);
    const predictedObjs = MusicMan.detectKeysAndScales(this.props.keyFinderNotes, this.props.scale, 'predict');
    const filteredObjs = MusicMan.detectKeysAndScales(this.props.keyFinderNotes, this.props.scale, 'filter');
    const flipEnabled = this.props.scaleRegion === 'western';
    
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
          <h2>{`Matching Keys`}</h2>
          <span className="found-keys-scalelabel">{`${MusicMan.getScaleTitle(this.props.scale)}`}</span><span>{'scales only'}</span>
          <div className="key-list">
              <span/>
            {foundKeys.map((note, index) => (
              <span 
                key={'note-' + index} 
                className={ note === this.props.musicKey ? 'active' : null } 
                onClick={() => this.onSetKey(note)}>
                {note}
              </span>
            ))}
          </div>
          <hr/>
          <h2>{`Predicted Scales & Keys`}</h2>
          <div className="scale-list">
            {predictedObjs.map((foundObj, index) => (
              <p 
                key={'notep-' + index} 
                className={ (foundObj.key === this.props.musicKey && foundObj.scale === this.props.scale) ? 'active' : null } 
                onClick={() => this.onSetScaleKey(foundObj.key, foundObj.scale)}>
                {foundObj.scale + ': ' + foundObj.key}
              </p>
            ))}
          </div>
          <hr/>
          <h2>{`Filtered Scales & Keys`}</h2>
          <div className="scale-list">
            {filteredObjs.map((foundObj, index) => (
              <p 
                key={'notef-' + index} 
                className={ (foundObj.key === this.props.musicKey && foundObj.scale === this.props.scale) ? 'active' : null } 
                onClick={() => this.onSetScaleKey(foundObj.key, foundObj.scale)}>
                {foundObj.scale + ': ' + foundObj.key}
              </p>
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
  fretChanges: state.fretChanges,
  musicKey: state.musicKey,
  scale: state.scale,
  scaleRegion: state.scaleRegion
}))(ToolsPanel);
