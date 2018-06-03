import React, { Component } from 'react';

import { connect } from 'src/store';
require('./style.less');

class Main extends Component {

  render() {
    if(!this.props.loaded){
      return (
        <div>
          <h1>{'Please wait... loading...'}</h1>
          <button onClick={() => this.props.actions.toggleLoaded()}>{'toggle'}</button>
        </div>
      );
    }else{
      return (
        <div>
          <h1>{'LOADED'}</h1>
          <button onClick={() => this.props.actions.toggleLoaded()}>{'toggle'}</button>
        </div>
      );
    }

  }
}

//- pass this component through the connect method to attach store values to props.
//- actions get mapped to props without explicitly stating anything. you can use any action from the store.
export default connect(state => ({ 
  loaded: state.loaded
}))(Main);
