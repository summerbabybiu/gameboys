import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { EnableKeyboardController } from './GameController';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

EnableKeyboardController();