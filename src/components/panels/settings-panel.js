import React, { Component } from 'react';
import { connect } from 'src/store';

require('./style.less');
import ComboButton from 'src/components/shared/combo-button';

class SettingsPanel extends Component {
  onToggleScaleMode(){
    const newPlayMode = this.props.playMode === 'note' ? 'scale' : 'note';
    console.log('new mode:', newPlayMode)
    this.props.actions.setPlayMode(newPlayMode);
  }

  render() {
    return(
      <div>
        <div className="selection-buttons">

          <ComboButton  onClickMethod={(e) => this.onToggleScaleMode(e)}
                        onClickParam={this.props.playMode}
                        isActive={this.props.playMode}
                        icon="icon-scalemode" 
                        title={`Playback: ${this.props.playMode}`} />

          <ComboButton  onClickMethod={this.props.actions.setDefaultSettings}
                        isActive={false}
                        icon="icon-reset" 
                        title="Reset Layout" />
        </div>
        <div className="volume-container">
          <p>{'volume'}</p>
          <input type='range' value={this.props.volume} min={0.0} max={1.0} step={0.05} onChange={e => this.props.actions.setVolume(e.target.value)} />
        </div>

      </div>
    );
  }
}

export default connect(state => ({ 
  playMode: state.playMode,
  volume: state.volume,
}))(SettingsPanel);
