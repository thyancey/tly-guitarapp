import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class ControlPanel extends Component {
  createInstrumentButtons(instrument){
    const retArray = [];
    for(let instrumentLabel in instrument){
      if(instrument.hasOwnProperty(instrumentLabel)){
        retArray.push(<StoreButton  actionMethod={this.props.actions.setInstrument}
                                    actionParam={instrumentLabel}
                                    isActive={(instrumentLabel === this.props.instrument)} 
                                    title={instrument[instrumentLabel].title}
                                    key={'instrument-' + instrumentLabel}/>);
      }
    }
    return retArray;
  }
  createMidiButtons(instrument){
    const retArray = [];
    for(let instrumentLabel in instrument){
      if(instrument.hasOwnProperty(instrumentLabel)){
        retArray.push(<StoreButton  actionMethod={this.props.actions.setMidiInstrument}
                                    actionParam={instrumentLabel}
                                    isActive={(instrumentLabel === this.props.midiInstrument)} 
                                    title={instrument[instrumentLabel].title}
                                    key={'midiinstrument-' + instrumentLabel}/>);
      }
    }
    return retArray;
  }

  render() {
    const instruments = MusicMan.getInstruments();
    const midiInstruments = MusicMan.getMidiInstruments();
    
    return (
      <div className="instrument-groups">
        <div className="left">
          <h2>{'Instrument'}</h2>
          <div>
            {this.createInstrumentButtons(instruments)}
          </div>
        </div>
        <div className="right">
          <h2>{'MIDI'}</h2>
          <div>
            {this.createMidiButtons(midiInstruments)}
          </div>
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  instrument: state.instrument,
  midiInstrument: state.midiInstrument
}))(ControlPanel);
