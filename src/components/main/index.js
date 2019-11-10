import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicBox from 'src/components/musicbox';
import ErrorContainer from 'src/components/error-container';

import DragCover from 'src/components/main/drag-cover';
import Workspace from './workspace';

require('./style.less');

class Main extends Component {
  constructor(){
    super();
    global.dispatchMusicEvent = (musicEvent) => {
      this.refs.musicBox.onMusicEvent(musicEvent);
    }

    this.state = {
      activeError:null
    };
  }


  render() {
    let mainClassName = 'main';
    if(this.props.isDragging){
      mainClassName += ' dragging';
    }

    return(
      <div className={mainClassName} >
        <ErrorContainer activeError={this.state.activeError}/>
        <MusicBox ref="musicBox" scale={this.props.scale} midiInstrument={this.props.midiInstrument} volume={this.props.volume} />
        <DragCover  isDragging={this.props.isDragging} 
                    heldPanelId={this.props.heldPanelId} 
                    panelPositions={this.props.panelPositions} 
                    setSpacerPosition={this.props.actions.setSpacerPosition} />
        <Workspace layout={'vertical'} panels={this.state.panels} />
      </div>
    );
  }

}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume,
  scale: state.scale,
  panelPositions: state.panelPositions,
  isDragging: state.isDragging,
  heldPanelId: state.heldPanelId,
  layout: 'vertical'
}))(Main);