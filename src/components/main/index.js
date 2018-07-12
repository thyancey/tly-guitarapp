import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import Fretboard from 'src/components/fretboard-panel';
import MusicBox from 'src/components/musicbox';

import ChordPanel from 'src/components/panels/chord-panel';
import InstrumentPanel from 'src/components/panels/instrument-panel';
import MusicKeyPanel from 'src/components/panels/musickey-panel';
import NoteDisplayPanel from 'src/components/panels/notedisplay-panel';
import ScalePanel from 'src/components/panels/scale-panel';
import ToolsPanel from 'src/components/panels/tools-panel';
import Panel from 'src/components/panels/panel';

import DragCover from 'src/components/main/drag-cover';

require('./style.less');

class Main extends Component {
  constructor(){
    super();
    global.dispatchMusicEvent = (musicEvent) => {
      this.refs.musicBox.onMusicEvent(musicEvent);
    }

    this.state = {
      panels:{
        musicKey:{
          panelClass: 'musickey',
          title: 'Key',
          component: <MusicKeyPanel/>
        },
        scale:{
          panelClass: 'scale',
          title: 'Scale',
          component: <ScalePanel/>
        },
        notedisplay:{
          panelClass: 'notedisplay',
          title: 'Notes',
          component: <NoteDisplayPanel/>
        },
        fret:{
          panelClass: 'fret',
          title: 'Fretboard',
          component: <Fretboard/>
        },
        chord:{
          panelClass: 'chord',
          title: 'Open Chords',
          component: <ChordPanel/>
        },
        instrument:{
          panelClass: 'instrument',
          title: 'Instrument',
          component: <InstrumentPanel/>
        },
        tools:{
          panelClass: 'tools',
          title: 'Settings',
          component: <ToolsPanel/>
        }
      }
    };
  }

  onPanelStartedDrag(panelId){
    this.props.actions.dragPanel(panelId);
  }

  onCoverStoppedDrag(e, panelId){
    this.props.actions.dropPanel(panelId);
  }

  renderPanelGroup(positionId, panelPositions, spacerPosition){
    // console.log('renderPanelGroup(' + positionId + ', ', panelPositions);
    let interrupter = 0;
    let spacerIdx = -1;

    if(spacerPosition && spacerPosition.panel === positionId){
      // console.log(positionId + ' got a spacer at ' + spacerPosition.index);
      spacerIdx = spacerPosition.index;
    }
    const retVal = [];
    panelPositions.forEach((panelId, idx) => {
      const panel = this.state.panels[panelId];
      if(!panel){
        console.error(`invalid panel "${panelId}" requested`);
        interrupter ++;
        return;
      }

      if(spacerIdx > -1){
        if(idx === spacerIdx){
          retVal.push(<div key={interrupter} className={'panel-spacer'} />);
          interrupter ++;
        }
      }

      retVal.push(
        <Panel  id={panelId} 
                isBeingDragged={panelId === this.props.heldPanelId}
                key={interrupter} 
                panelClass={panel.panelClass} 
                title={panel.title} 
                children={panel.component} 
                startDrag={e => this.onPanelStartedDrag(e)} >
        </Panel>
      );

      interrupter ++;
    });

    return retVal;
  }


  render() {
    let mainClassName = 'main';
    if(this.props.isDragging){
      mainClassName += ' dragging';
    }

    return(
      <div className={mainClassName} >
        <MusicBox ref="musicBox" midiInstrument={this.props.midiInstrument} volume={this.props.volume} />
        <DragCover  isDragging={this.props.isDragging} 
                    stopDrag={(e, hp) => this.onCoverStoppedDrag(e, hp)}
                    heldPanelId={this.props.heldPanelId} 
                    panelPositions={this.props.panelPositions} 
                    setSpacerPosition={this.props.actions.setSpacerPosition} />
        <div className="panelgroup-left">
          {this.renderPanelGroup('left', this.props.panelPositions.left, this.props.spacerPosition)}
        </div>
        <div className="panelgroup-center">
          {this.renderPanelGroup('center', this.props.panelPositions.center, this.props.spacerPosition)}
        </div>
        <div className="panelgroup-right">
          {this.renderPanelGroup('right', this.props.panelPositions.right, this.props.spacerPosition)}
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume,
  panelPositions: state.panelPositions,
  panelChanges: state.panelChanges,
  spacerPosition: state.spacerPosition,
  isDragging: state.isDragging,
  heldPanelId: state.heldPanelId
}))(Main);