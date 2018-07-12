import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class ControlPanel extends Component {
  createInstrumentButtons(instrument){
    const retArray = [];
    for(var instrumentLabel in instrument){
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


  render() {
    return (
      <div className="panel-container panel-instrument">
        <h2>{'Instrument'}</h2>
        {this.createInstrumentButtons(MusicMan.getInstruments())}
      </div>
    );
  }

}

export default connect(state => ({
  instrument: state.instrument
}))(ControlPanel);
