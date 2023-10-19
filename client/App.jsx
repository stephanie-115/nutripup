import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

export default function App() {

  return (
  <div className="app">
        <Navbar />
        <UserProfile />
  </div>
  )
}