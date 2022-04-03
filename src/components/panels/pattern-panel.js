import React, { Component } from 'react';
import { connect } from 'src/store';
import StoreButton from 'src/components/shared/store-button';

require('./style.less');

class PatternPanel extends Component {

  onPatternClick(patternId){
    if(this.props.pattern === patternId){
      patternId = null;
    }
    this.props.actions.setPattern(patternId);
  }

  createPatternButtons(instrument, scale){
    const foundPatterns = MusicMan.getPatterns(instrument, scale);
    let retArray = []

    retArray = foundPatterns.map((pattern, index) => (
      <StoreButton  actionMethod={(pattern) => this.onPatternClick(pattern)}
                    actionParam={pattern.id}
                    extraClasses={'centered-text'}
                    isActive={(pattern.id === this.props.pattern)} 
                    isDisabled={pattern.disabled} 
                    title={`#${index + 1}`}
                    key={index}/>
    ));

    return retArray;
  }


  render() {
    return (
      <React.Fragment>
        {this.createPatternButtons(this.props.instrument, this.props.scale)}
      </React.Fragment>
    );
  }
}

export default connect(state => ({ 
  scale: state.scale,
  playScales: state.playMode === 'scale',
  instrument: state.instrument,
  pattern: state.pattern
}))(PatternPanel);
