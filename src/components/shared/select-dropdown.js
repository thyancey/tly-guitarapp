import React, { Component } from 'react';

require('./style.less');

export default class SelectDropdown extends Component {
  render() {
    let className = 'select-dropdown';
    if(this.props.extraClasses){
      className += ` ${this.props.extraClasses}`;
    }

    return (
      <select 
        name={this.props.name}
        className={className} 
        value={this.props.value} 
        onChange={e => this.props.onChange(e.target.value)}
      >
        {this.props.options.map((opt, idx) => (
          <option
            key={opt.value}
            value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
}