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
import PatternPanel from 'src/components/panels/pattern-panel';
import SettingsPanel from 'src/components/panels/settings-panel';
import Panel from 'src/components/panels/panel';

require('./style.less');

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
  pattern:{
    panelClass: 'pattern',
    title: 'Patterns',
    component: <PatternPanel/>
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
  settings:{
    panelClass: 'settings',
    title: 'Settings',
    component: <SettingsPanel/>
  }, 
  tools:{
    panelClass: 'tools',
    title: 'Tools',
    component: <ToolsPanel/>
  }
}

class PanelGroup extends Component {
  onPanelStartedDrag(panelId){
    this.props.actions.dragPanel(panelId);
  }

  renderSpacer(){
    return (
      <div key="spacer" className={'drag-spacer'}>
        <div />
      </div>
    );
  }

  render() {
    const { groupId, panelPositions, spacerPosition } = { ...this.props };
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

    if(spacerPosition && spacerPosition.panel === groupId){
      retVal.splice(spacerPosition.index, 0, this.renderSpacer());
    }

    // return retVal;
    return (
      <div className={`panelgroup mod-${groupId}`} >
        {retVal}
      </div>
    )
  }
}

export default connect(state => ({
  spacerPosition: state.spacerPosition,
  isDragging: state.isDragging,
  heldPanelId: state.heldPanelId
}))(PanelGroup);