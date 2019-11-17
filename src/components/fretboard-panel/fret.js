import React, { Component } from 'react';

export default class Fret extends Component {

  render() {
    let className = '';

    if(this.props.chord){
      if(this.props.isChordFret){
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
    if(this.props.isFound){
      className += ' found-fret';
    }

    if(this.props.isAlternate){
      className = 'altfret ' + className;
      return (
        <div className={className} onClick={(e) => this.props.selectNote(this.props.octaveNote, this.props.fretIdx, e)}>
          <div className="altfret-label">
            <span>{this.props.note}</span>
          </div>
        </div>
      );
    }else{
      className = 'fret ' + className;

      return (
        <div className={className} onClick={(e) => this.props.selectNote(this.props.octaveNote, this.props.fretIdx, e)}>
          <div className="round-fret fret-note">
            <div className="round-fret-circle">
              <span>{this.props.note}</span>
            </div>
          </div>
          <div className="round-fret fret-idx">
            <div className="round-fret-circle">
              <span>{this.props.fretIdx}</span>
            </div>
          </div>
        </div>
      );
    }
  }
}
