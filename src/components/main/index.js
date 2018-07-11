import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import ControlPanel from 'src/components/control-panel';
import Fretboard from 'src/components/fretboard';

// import MusicBox from 'src/utils/musicbox';
import MusicBox from 'src/components/musicbox';

require('./style.less');

class Main extends Component {
  constructor(){
    super();
  }

  dispatchMusicEvent(musicEvent){
    this.refs.musicBox.onMusicEvent(musicEvent);
  }

  render() {
    return(
      <div className="main" >
        <MusicBox ref="musicBox" />
        <ControlPanel />
        <Fretboard dispatchMusicEvent={(musicEvent) => this.dispatchMusicEvent(musicEvent)} />
      </div>
    );
  }
}

  /*
  render() {
    return(
      <div className="main">
        <ControlPanel         musicJSON={this.props.musicJSON}
                              activeScale={this.props.activeScale}
                              activeKey={this.props.activeKey}
                              activeTuning={this.props.activeTuning}
                              activeOctave={this.props.activeOctave}
                              activeChord={this.props.activeChord}
                              setActiveChord={this.props.setActiveChord}
                              setActiveKey={this.props.setActiveKey}
                              setActiveScale={this.props.setActiveScale}
                              setActiveOctave={this.props.setActiveOctave}
                              setActiveTuning={this.props.setActiveTuning} />
        <div className="guitar-container">

          <FretboardContainer musicJSON={this.props.musicJSON}
                              activeScale={this.props.activeScale}
                              activeOctave={this.props.activeOctave}
                              activeKey={this.props.activeKey}
                              activeShapeScale={this.props.activeShapeScale}
                              activeTuning={this.props.activeTuning} 
                              activeChord={this.props.activeChord}
                              selectionMode={this.props.selectionMode} 
                              setActiveShapeScale={this.props.setActiveShapeScale}
                              setActiveOctave={this.props.setActiveOctave} />

          <SelectionTools     selectionMode={this.props.selectionMode}
                              setSelectionMode={this.props.setSelectionMode} />
        </div>

          <FretPanel          activeChord={this.props.activeChord}
                              activeTuning={this.props.activeTuning}
                              activeScale={this.props.activeScale}
                              activeKey={this.props.activeKey}
                              setActiveChord={this.props.setActiveChord} />
      </div>
    );
  }
}*/

//- pass this component through the connect method to attach store values to props.
//- actions get mapped to props without explicitly stating anything. you can use any action from the store.
export default connect(state => ({ 
  musicKey: state.musicKey
}))(Main);
