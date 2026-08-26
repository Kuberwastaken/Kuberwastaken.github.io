import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Terminal from './components/Terminal';
import ToS from './components/ToS';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Terminal />} />
          <Route path="/tos" element={<ToS />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;