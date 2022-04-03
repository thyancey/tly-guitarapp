import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import SelectDropdown from 'src/components/shared/select-dropdown';

require('./style.less');

class ModePanel extends Component {
  onModeChange(value){
    this.props.actions.setMode(value);
  }

  render() {
    const modes = MusicMan.getModes();
    return (
      <React.Fragment>
          <SelectDropdown 
            name="modes" 
            value={this.props.mode} 
            onChange={value => this.onModeChange(parseInt(value))}
            options={modes}
          >
          </SelectDropdown>
      </React.Fragment>
    );
  }

}

export default connect(state => ({ 
  mode: state.mode
}))(ModePanel);
