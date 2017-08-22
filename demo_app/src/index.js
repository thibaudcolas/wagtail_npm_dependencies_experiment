import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initExplorer } from 'wagtail';

ReactDOM.render(<App />, document.getElementById('root'));

document.addEventListener('DOMContentLoaded', () => {
  const explorerNode = document.querySelector('[data-explorer-menu]');
  const toggleNode = document.querySelector('[data-explorer-start-page]');

  if (explorerNode && toggleNode) {
    initExplorer(explorerNode, toggleNode);
  }
});
