import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Define the linkHref function
window.linkHref = (url) => {
  window.open(url, '_blank');
};

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
