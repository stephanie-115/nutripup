import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/Navbar';

export default function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
      </div>
    </Router>
  );
}
