import React, { Component } from 'react';

import Fret from'./fret';

export default class FretboardString extends Component {

  render() {
    return (
      <div className="fretboard-string" style={{ height: this.props.stringHeight }}>
        { this.props.frets.map((f, idx) => (
          <Fret 
            key={idx} 
            simpleNote={f.simpleNote}
            octave={f.octave}
            octaveNote={f.octaveNote}
            isInChord={f.isInChord}
            isInFound={f.isInFound}
            noteIdx={f.noteIdx}
            fretData={f} />
        )) }
      </div>
    );
  }
}

