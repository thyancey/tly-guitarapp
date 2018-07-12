import React, { Component } from 'react';
import { connect } from 'src/store';

require('./style.less');
import ComboButton from 'src/components/shared/combo-button';

class ToolsPanel extends Component {
  onToggleWriteMode(mode){
    let newSelectionMode = Object.assign({}, this.props.selectionMode);
    newSelectionMode.noteClick = !mode;
    this.props.actions.setSelectionMode(newSelectionMode);
  }

  onToggleScaleMode(scaleMode){
    let newSelectionMode = Object.assign({}, this.props.selectionMode);
    newSelectionMode.scaleMode = !scaleMode;
    this.props.actions.setSelectionMode(newSelectionMode);
  }

  render() {
    return(
      <div>
        <div className="selection-buttons">
          <ComboButton  onClickMethod={(mode) => this.onToggleWriteMode(mode)}
                        onClickParam={this.props.selectionMode.noteClick}
                        isActive={this.props.selectionMode.noteClick}
                        icon="icon-editnote" 
                        title="Change key" />

          <ComboButton  onClickMethod={(scaleMode) => this.onToggleScaleMode(scaleMode)}
                        onClickParam={this.props.selectionMode.scaleMode}
                        isActive={this.props.selectionMode.scaleMode}
                        icon="icon-scalemode" 
                        title="Play scales" />

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
  selectionMode: state.selectionMode,
  volume: state.volume,
}))(ToolsPanel);
