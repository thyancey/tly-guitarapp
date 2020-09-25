import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicBox from 'src/components/musicbox';
import ErrorContainer from 'src/components/error-container';
import MusicMan from 'src/utils/musicman';

import DragCover from 'src/components/main/drag-cover';
import Workspace from './workspace';

require('./style.less');

class Main extends Component {
  constructor(){
    console.log('constructed')
    super();
    global.MusicMan = MusicMan;
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
                    panelPositions={this.props.layoutGroups[this.props.currentLayout]} 
                    setSpacerPosition={this.props.actions.setSpacerPosition} />
        <Workspace layout={this.props.currentLayout} panels={this.state.panels} panelPositions={this.props.layoutGroups[this.props.currentLayout]} />
      </div>
    );
  }

}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume,
  scale: state.scale,
  layoutGroups: state.layoutGroups,
  isDragging: state.isDragging,
  heldPanelId: state.heldPanelId,
  currentLayout: state.currentLayout
}))(Main);