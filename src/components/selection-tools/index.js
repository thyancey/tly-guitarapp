import React, { Component } from 'react';

require('./style.less');
import ImageButton from 'src/components/shared/image-button';

export default class SelectionTools extends Component {
  onToggleWriteMode(mode){
    let newSelectionMode = Object.assign({}, this.props.selectionMode);
    newSelectionMode.noteClick = !mode;
    this.props.setSelectionMode(newSelectionMode);
  }

  onToggleScaleMode(scaleMode){
    let newSelectionMode = Object.assign({}, this.props.selectionMode);
    newSelectionMode.scaleMode = !scaleMode;
    this.props.setSelectionMode(newSelectionMode);
  }

  render() {
    return(
      <div className="selection-tools">
          <ImageButton  onClickMethod={(mode) => this.onToggleWriteMode(mode)}
                        onClickParam={this.props.selectionMode.noteClick}
                        isActive={this.props.selectionMode.noteClick}
                        icon="icon-editnote" 
                        title="NOTE" />

          <ImageButton  onClickMethod={(scaleMode) => this.onToggleScaleMode(scaleMode)}
                        onClickParam={this.props.selectionMode.scaleMode}
                        isActive={this.props.selectionMode.scaleMode}
                        icon="icon-scalemode" 
                        title="edit sclae" />

      </div>
    );
  }
}
