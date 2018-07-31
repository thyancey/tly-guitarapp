import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import Fretboard from 'src/components/fretboard-panel';
import MusicBox from 'src/components/musicbox';

import ChordPanel from 'src/components/panels/chord-panel';
import InstrumentPanel from 'src/components/panels/instrument-panel';
import MusicKeyPanel from 'src/components/panels/musickey-panel';
import NoteDisplayPanel from 'src/components/panels/notedisplay-panel';
import ChordDisplayPanel from 'src/components/panels/chorddisplay-panel';
import ScalePanel from 'src/components/panels/scale-panel';
import ToolsPanel from 'src/components/panels/tools-panel';
import Panel from 'src/components/panels/panel';

import ErrorContainer from 'src/components/error-container';

import DragCover from 'src/components/main/drag-cover';

require('./style.less');

class Main extends Component {
  constructor(){
    super();
    global.dispatchMusicEvent = (musicEvent) => {
      this.refs.musicBox.onMusicEvent(musicEvent);
    }

    this.state = {
      activeError:null,
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
        chorddisplay:{
          panelClass: 'chorddisplay',
          title: 'Chords',
          component: <ChordDisplayPanel/>
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

  onCoverStoppedDrag(panelId){
    this.props.actions.dropPanel(panelId);
  }

  renderPanelGroup(positionId, panelPositions, spacerPosition){
    // console.log('renderPanelGroup(' + positionId + ', ', panelPositions);
    const retVal = [];
    panelPositions.forEach((panelId, idx) => {
      const panel = this.state.panels[panelId];
      if(!panel){
        console.error(`invalid panel "${panelId}" requested`);
        return;
      }

      retVal.push(
        <Panel  id={panelId} 
                isBeingDragged={panelId === this.props.heldPanelId}
                key={idx} 
                panelClass={panel.panelClass} 
                title={panel.title} 
                children={panel.component} 
                setDraggingPosition={(x,y,isDragging) => this.props.actions.setDraggingPosition(x,y,isDragging)}
                startDrag={e => this.onPanelStartedDrag(e)} >
        </Panel>
      );
    });

    if(spacerPosition && spacerPosition.panel === positionId){
      retVal.splice(spacerPosition.index, 0, this.renderSpacer());
    }

    return retVal;
  }

  renderSpacer(){
    return (
      <div key="spacer" className={'panel-spacer'}>
        <div />
      </div>
    );
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
        <div className="panelgroup mod-left" data-panelgroup="left">
          <div className="panelgroup-column">
          {this.renderPanelGroup('left', this.props.panelPositions.left, this.props.spacerPosition)}
          </div>
        </div>
        <div className="panelgroup mod-center" data-panelgroup="center">
          <div className="panelgroup-column">
          {this.renderPanelGroup('center', this.props.panelPositions.center, this.props.spacerPosition)}
          </div>
        </div>
        <div className="panelgroup mod-right" data-panelgroup="right">
          <div className="panelgroup-column">
          {this.renderPanelGroup('right', this.props.panelPositions.right, this.props.spacerPosition)}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  midiInstrument: state.midiInstrument,
  volume: state.volume,
  scale: state.scale,
  panelPositions: state.panelPositions,
  panelChanges: state.panelChanges,
  spacerPosition: state.spacerPosition,
  isDragging: state.isDragging,
  heldPanelId: state.heldPanelId
}))(Main);