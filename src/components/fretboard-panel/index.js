import React, { Component } from 'react';
import { connect } from 'src/store';

import FretboardRow from './fretboard-row';
import FretboardString from './fretboard-string';

require('./style.less');


class Fretboard extends Component {
  componentDidMount(){
    global.setTimeout(() => {
      this.props.actions.seemsLikeThisIsUnecessaryButWhateverJustStartTheStoreCorrectly();
    }, 0);
  }

  renderFretRows(numFrets){
    let retVal = [];
    for(let i = 0; i < numFrets; i++){
      retVal.push(<FretboardRow key={i} fretIdx={i} />)
    }
    
    return retVal;
  }

  //- remember to reverse the order of the strings, cause im a dummy and defined them bottom to top
  render() {
    return (
      <div className="fretboard">
        <div className="fret-rows-container" >
          { this.renderFretRows( this.props.maxFrets) }
        </div>
        <div className="fretboard-strings-container" >
          { this.props.fretMatrix.reverse().map((stringObj, i) => (
            <FretboardString 
              key={i} 
              frets={stringObj.frets}
              fretBounds={stringObj.fretBounds}
              maxFrets={this.props.maxFrets}
              stringHeight={(100 / this.props.fretMatrix.size) + '%'} />
          )) }
        </div>
      </div>
    );
  }
}


export default connect(state => ({ 
  maxFrets: state.maxFrets,
  fretMatrix: state.fretMatrix
}))(Fretboard);
