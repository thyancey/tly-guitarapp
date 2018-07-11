import React, { Component } from 'react';

require('./style.less');

export default class StoreButton extends Component {
  render() {
    let className = 'store-button';
    if(this.props.isActive){
      className += ' active-button';
    }

    if(this.props.isDisabled){
      console.log(this.props.title + " is disabled");
      className += ' disabled-button';

      return (
        <div className={className}>
          <span>{this.props.title}</span>
        </div>
      );
    }

    return (
      <div className={className} onClick={() => this.props.actionMethod(this.props.actionParam)}>
        <span >{this.props.title}</span>
      </div>
    );
  }
}