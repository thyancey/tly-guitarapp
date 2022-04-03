import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';
import SelectDropdown from 'src/components/shared/select-dropdown';

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
  createMidiButtons(instruments){
    const retArray = [];
    for(let instrumentLabel in instruments){
      if(instruments.hasOwnProperty(instrumentLabel)){
        retArray.push(<StoreButton  actionMethod={this.props.actions.setMidiInstrument}
                                    actionParam={instrumentLabel}
                                    isActive={(instrumentLabel === this.props.midiInstrument)} 
                                    title={instruments[instrumentLabel].title}
                                    key={'midiinstrument-' + instrumentLabel}/>);
      }
    }
    return retArray;
  }

  onMidiInstrumentChange(value){
    this.props.actions.setMidiInstrument(value);
  }
  
  onInstrumentChange(value){
    this.props.actions.setInstrument(value);
  }
  
  
  getInstrumentOptions(){
    const instObj = MusicMan.getInstruments();
    return Object.keys(instObj).map(k => ({
      label: instObj[k].title,
      value: k
    }));
  }

  getMidiOptions(){
    const instObj = MusicMan.getMidiInstruments();
    return Object.keys(instObj).map(k => ({
      label: instObj[k].title,
      value: k
    }));
  }

  render() {
    // const instruments = MusicMan.getInstruments();
    const midiInstruments = this.getMidiOptions();
    const instruments = this.getInstrumentOptions();
    
    return (
      <div className="instrument-groups">
        <div className="left">
          <h2>{'Instrument'}</h2>
          <SelectDropdown 
            name="instrument" 
            value={this.props.instrument} 
            onChange={value => this.onInstrumentChange(value)}
            options={instruments}
          />
        </div>
        <div className="right">
          <h2>{'MIDI'}</h2>
          <SelectDropdown 
            name="midi instrument" 
            value={this.props.midiInstrument} 
            onChange={value => this.onMidiInstrumentChange(value)}
            options={midiInstruments}
          />
        </div>
      </div>
    );
  }

}

export default connect(state => ({
  instrument: state.instrument,
  midiInstrument: state.midiInstrument
}))(ControlPanel);
