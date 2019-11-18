import React, { Component } from 'react';
import { connect } from 'src/store';

class Fret extends Component {
  
  selectNote(e){
    this.props.actions.onFretSelected({
      isFindModifierPressed: e.shiftKey,
      isSetModifierPressed: e.ctrlKey,
      simpleNote: this.props.simpleNote,
      octaveNote: this.props.octaveNote,
      octave: this.props.octave
    });
  }

  render() {
    let classNames = [ 'fret' ];

    if(this.props.isInChord){
      classNames.push('chord-fret');
    }

    if(this.props.noteIdx === 0){
      classNames.push('root-fret');
    }
    
    if(this.props.noteIdx > -1){
      classNames.push('active-fret');
    }

    if(this.props.isInFound){
      classNames.push('found-fret');
    }

    return (
      <div className={classNames.join(' ')} onClick={(e) => this.selectNote(e)}>
        <div className="fret-label">
          <span>{this.props.simpleNote}</span>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ 
}))(Fret);
