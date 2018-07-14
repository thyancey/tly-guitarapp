import React, { Component } from 'react';

import './style.less';


export default class ErrorContainer extends Component {
  renderError(activeError){
    switch(activeError.type){
      case 'webAudioNotSupported':
        return(
          <div className="error-blob">
            <h1>{'~ This browser is not supported ~'}</h1>
            <p>{'This application makes use of newer web features for playing midi sounds.'}</p>
            <p>{'Please use a modern browser that supports the web audio api:'}</p>
            <div className="link-group">
              <a href="https://www.google.com/chrome/" target="_blank">{'Chrome'}</a>
              <span>{' | '}</span>
              <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank">{'Firefox'}</a>
              <span>{' | '}</span>
              <a href="https://www.apple.com/safari/" target="_blank">{'Safari'}</a>
            </div>
          </div>
        )
        break;
      default: 
        console.error(`activeError type ${activeError.type} is not a valid type`);
        return null;
    }

  }
  render() {
    if(this.props.activeError && this.props.activeError.type){
      const errorMessage = this.renderError(this.props.activeError);
      if(errorMessage){
        return (
          <div className="page-error active">
            {errorMessage}
          </div>
        );
      }else{
        return (
          <div className="page-error">
          </div>
        );
      }
    }else{
      return (
        <div className="page-error">
        </div>
      );
    }
  }
}
