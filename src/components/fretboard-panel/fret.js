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
    let className = '';
    if(this.props.chord){
      if(this.props.isInChord){
        className += ' active-fret';

        if(this.props.noteIdx === 0){
          className += ' root-fret';
        }
      }
    }else if(this.props.noteIdx > -1){
      className += ' active-fret';
      if(this.props.noteIdx === 0){
        className += ' root-fret';
      }
    }
    if(this.props.isInFound){
      className += ' found-fret';
    }

    className = 'altfret ' + className;
    return (
      <div className={className} onClick={(e) => this.selectNote(e)}>
        <div className="altfret-label">
          <span>{this.props.simpleNote}</span>
        </div>
      </div>
    );
  }
}

export default connect(state => ({ 
}))(Fret);
