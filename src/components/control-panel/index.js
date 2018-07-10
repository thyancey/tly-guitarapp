import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';

import MusicMan from 'src/utils/musicman';

require('./style.less');

class ControlPanel extends Component {
  onScaleClick(scaleLabel){
    this.props.actions.setScale(scaleLabel);
    this.props.actions.setChord(null);

    const scaleNotes = MusicMan.getScale(this.props.musicKey, scaleLabel, this.props.octave);
    // MusicMan.playMidiScale(scaleNotes, true);
  }

  createScaleButtons(scales){
    const retArray = [];
    for(var scaleLabel in scales){
      if(scales.hasOwnProperty(scaleLabel)){
        retArray.push(<StoreButton  actionMethod={(param) => this.onScaleClick(param)}
                                    actionParam={scaleLabel}
                                    isActive={(scaleLabel === this.props.scale)} 
                                    title={scales[scaleLabel].title}
                                    key={'scale-' + scaleLabel}/>);
      }
    }

    return retArray;
  }

  createTuningButtons(tuning){
    const retArray = [];
    for(var tuningLabel in tuning){
      if(tuning.hasOwnProperty(tuningLabel)){
        retArray.push(<StoreButton  actionMethod={this.props.actions.setTuning}
                                    actionParam={tuningLabel}
                                    isActive={(tuningLabel === this.props.tuning)} 
                                    title={tuning[tuningLabel].title}
                                    key={'tuning-' + tuningLabel}/>);
      }
    }
    return retArray;
  }

  createNoteButtons(){
    return MusicMan.getNotes().map((note, index) => (
            <StoreButton  actionMethod={this.props.actions.setMusicKey} 
                          actionParam={note} 
                          isActive={(note === this.props.musicKey)} 
                          title={note}
                          key={'key-' + index}/>
    ));
  }

  render() {
    const simpleNotes = MusicMan.getScale(this.props.musicKey, this.props.scale);
    return (
      <div className="control-panel">
        <div className="key-buttons">
          {this.createNoteButtons()}
        </div>
        <div className="scale-buttons">
          {this.createScaleButtons(MusicMan.getScales())}
        </div>
        <div className="active-octave">
          <span>Octave: {this.props.octave}</span>
        </div>
        <div className="active-notes">
          {simpleNotes.map((note, index) => 
            <span key={'note-' + index}>{note}</span>
          )}
        </div>
        <span>Tuning</span>
        <div className="tuning-buttons">
          {this.createTuningButtons(MusicMan.getTuning())}
        </div>
      </div>
    );
  }

}


//- pass this component through the connect method to attach store values to props.
//- actions get mapped to props without explicitly stating anything. you can use any action from the store.
export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  tuning: state.tuning,
  octave: state.octave
}))(ControlPanel);
