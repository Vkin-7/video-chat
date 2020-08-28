import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ClientComponent from './ClientComponent';

ReactDOM.render(
  <React.StrictMode>
    <ClientComponent />
  </React.StrictMode>,
  document.getElementById('root')
);