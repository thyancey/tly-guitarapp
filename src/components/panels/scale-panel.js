import React, { Component } from 'react';
import { connect } from 'src/store';

import StoreButton from 'src/components/shared/store-button';
import MusicMan from 'src/utils/musicman';

require('./style.less');

class ScalePanel extends Component {
  onScaleClick(scaleLabel){
    this.props.actions.setScale(scaleLabel);
    // this.props.actions.setChord(null);

    if(this.props.playScales){
      global.setTimeout(() => {
        this.props.actions.dispatchEasyMusicEvent({
          type: 'SCALE_FULL'
        });
      }, 0);
    }
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
      <div>
        {this.createScaleButtons(MusicMan.getScales())}
      </div>
    );
  }
}

export default connect(state => ({ 
  scale: state.scale,
  playScales: state.selectionMode.scaleMode
}))(ScalePanel);
