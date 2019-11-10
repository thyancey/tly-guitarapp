import React, { Component } from 'react';

export default class Fret extends Component {

  render() {
    let className = 'fret';

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

    return (
      <div className={className} onClick={() => this.props.selectNote(this.props.octaveNote, this.props.fretIdx)}>
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
        {/*}
        <div className="round-fret fret-octave">
          <div className="round-fret-circle">
            <span>{this.props.note + '' + this.props.octave}</span>
          </div>
        </div>
      */}
      </div>
    );
  }
}
