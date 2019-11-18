import React, { Component } from 'react';
import { connect } from 'src/store';

import MusicMan from 'src/utils/musicman';
import FretboardRow from './fretboard-row';
import FretboardString from './fretboard-string';

require('./style.less');
require('./alternate.less');


class Fretboard extends Component {
  componentDidMount(){
    this.props.actions.refreshFretMatrix();
  }

  renderFretRows(numFrets){
    let retVal = [];
    for(let i = 0; i < numFrets; i++){
      retVal.push(<FretboardRow key={i} fretIdx={i} />)
    }
    
    return retVal;
  }

  //- I don't usually like spreads, but it makes sense here. Only calculate fret stuff when you have to.
  //- save pretty much everything you want to give to the components in state, then just pass it in on render.

  //- remember to reverse the order of the strings, cause im a dummy and defined them bottom to top
  render() {
    return (
      <div className="fretboard fretboard-alternate">
        <div className="fret-rows-container" >
          { this.renderFretRows( this.props.maxFrets) }
        </div>
        <div className="fretboard-strings-container" >
          { this.props.fretMatrix.reverse().map((stringObj, i) => (
            <FretboardString 
              key={i} 
              frets={stringObj.frets}
              stringHeight={(100 / this.props.fretMatrix.size) - 1 + '%'} />
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
