import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GroupRoom from './GroupRoom';
import PeerToPeer from './PeerToPeer';
import NativeApp from './NativeApp';


ReactDOM.render(
  <React.StrictMode>
    <NativeApp />
  </React.StrictMode>,
  document.getElementById('root')
);