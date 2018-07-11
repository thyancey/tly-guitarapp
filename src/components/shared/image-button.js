import React, { Component } from 'react';

require('./style.less');

export default class StoreButton extends Component {
  render() {
    let className = 'image-button';
    if(this.props.isActive){
      className += ' active-button';
    }

    let iconClass = 'button-icon';
    if(this.props.icon){
      iconClass += ' ' + this.props.icon + '-' + this.props.isActive;
    }

    return (
      <div className={className} onClick={() => this.props.onClickMethod(this.props.onClickParam)} alt={this.props.title}>
        <div className={iconClass} />
      </div>
    );
  }
}