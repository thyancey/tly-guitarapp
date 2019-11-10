import React, { Component } from 'react';
import { connect } from 'src/store';

import Fretboard from 'src/components/fretboard-panel';
import ChordPanel from 'src/components/panels/chord-panel';
import InstrumentPanel from 'src/components/panels/instrument-panel';
import MusicKeyPanel from 'src/components/panels/musickey-panel';
import NoteDisplayPanel from 'src/components/panels/notedisplay-panel';
import ChordDisplayPanel from 'src/components/panels/chorddisplay-panel';
import ScalePanel from 'src/components/panels/scale-panel';
import ToolsPanel from 'src/components/panels/tools-panel';
import Panel from 'src/components/panels/panel';

require('./style.less');

const MAP_LAYOUTS = {
  vertical:{
    id: 'vertical',
    groups: [
      'left',
      'center',
      'right'
    ]
  },
  horizontal:{
    id: 'horizontal',
    groups: [
      'top',
      'bottom'
    ]
  }
}

const MAP_PANELS = {
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

class Workspace extends Component {
  onPanelStartedDrag(panelId){
    this.props.actions.dragPanel(panelId);
  }

  renderPanelGroup(positionId, panelPositions, spacerPosition){
    // console.log('renderPanelGroup(' + positionId + ', ', panelPositions);
    const retVal = [];
    panelPositions.forEach((panelId, idx) => {
      const panel = MAP_PANELS[panelId];
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
      <div key="spacer" className={'drag-spacer'}>
        <div />
      </div>
    );
  }


  render() {
    console.log('layout is ', this.props.layout);
    const layoutId = this.props.layout;
    const layout = MAP_LAYOUTS[layoutId];

    return(
      <div id="workspace" className={`layout-${this.props.layout}`}>
        { layout.groups.map((lO, i) => {
          const groupId = `GROUP_${i}`;
          return (
            <div className={`panelgroup mod-${lO}`} data-panelgroup={groupId} key={i}>
              {this.renderPanelGroup(groupId, this.props.panelPositions[groupId], this.props.spacerPosition)}
            </div>
          )
        })}
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
  heldPanelId: state.heldPanelId,
  layout: 'vertical'
}))(Workspace);