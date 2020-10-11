import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicBox from 'src/components/musicbox';
import ErrorContainer from 'src/components/error-container';
import MusicMan from 'src/utils/musicman';

import DragCover from 'src/components/main/drag-cover';
import Workspace from './workspace';
import InputManager from 'src/utils/input-manager';

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

    InputManager.create(global.document, this.onInputCommand.bind(this));
  }

  onInputCommand(command){
    if(command.action){
      if(command.action === 'setNoteFromMidi'){
        
          // {number: 40, name: "E", octave: 2}
          // { name: simpleNote, octave: octave - 1}
        const strOctave = String(command.payload.octave - 1);


        this.props.actions.onFretSelected({
          isFindModifierPressed: false,
          isSetModifierPressed: false,
          simpleNote: command.payload.name,
          octaveNote: `${command.payload.name}-${strOctave}`,
          octave: strOctave
        });
      }else{
        if(!this.props.actions[command.action]){
          console.error(`mapped input action "${command.action} does not match a valid action`);
        }else{
          this.props.actions[command.action](command.payload);
        }
      }
    }
  }

  render() {
    let mainClassName = 'main';
    if(this.props.isDragging){
      mainClassName += ' dragging';
    }

    return(
      <div className={mainClassName} >
        {/* <InputManager/> */}
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