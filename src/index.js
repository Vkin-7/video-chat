import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GroupRoom from './GroupRoom';
import PeerToPeer from './PeerToPeer';


ReactDOM.render(
  <React.StrictMode>
    <PeerToPeer />
  </React.StrictMode>,
  document.getElementById('root')
);