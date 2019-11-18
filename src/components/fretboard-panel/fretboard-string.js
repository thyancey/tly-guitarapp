import React, { Component } from 'react';

import Fret from'./fret';

export default class FretboardString extends Component {

  render() {
    console.log('render a string ', this.props.stringIdx)
    return (
      <div className="fretboard-string" style={{ height: this.props.stringHeight }}>
        { this.props.frets.map((f, idx) => (
          <Fret key={idx} isAlternate={this.props.isAlternate} {...f} />
        )) }
      </div>
    );
  }
}

