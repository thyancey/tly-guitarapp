import React, { Component } from 'react';

require('./style.less');

export default class ComboButton extends Component {
  render() {
    let className = 'combo-button';
    
    if(this.props.isDisabled){
      className += ' disabled-button';
    }else if(this.props.isActive){
      className += ' active-button';
    }

    let iconClass = 'button-icon';
    if(this.props.icon){
      iconClass += ' ' + this.props.icon + '-' + this.props.isActive;
    }

    return (
      <div className={className} onClick={(e) => this.props.onClickMethod(this.props.onClickParam)} alt={this.props.title}>
        <div className="icon-container">
          <div className={iconClass} />
        </div>
        <p>{this.props.title}</p>
      </div>
    );
  }
}