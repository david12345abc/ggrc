import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ScrollManager from './components/ScrollManager/ScrollManager';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <ScrollManager />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
