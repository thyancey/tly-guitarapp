import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class ScalePanel extends Component {
  onScaleClick(scaleLabel){
    this.props.actions.setScale(scaleLabel);
    this.props.actions.setChord(null);

    const octaveNote = `${this.props.musicKey}-${this.props.octave}`;
    const scaleNotes = MusicMan.getScale(octaveNote, scaleLabel);
    const midiNotes = MusicMan.getMidiScale(scaleNotes);

    this.props.actions.dispatchMusicEvent({
      type: 'SCALE_FULL',
      notes: midiNotes
    });
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

  render() {
    return (
      <div className="panel-container panel-scale">
        <h2>{'Scale'}</h2>
        {this.createScaleButtons(MusicMan.getScales())}
      </div>
    );
  }
}

export default connect(state => ({ 
  musicKey: state.musicKey,
  scale: state.scale,
  octave: state.octave
}))(ScalePanel);
