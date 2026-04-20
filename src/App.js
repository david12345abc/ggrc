import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager/ScrollManager';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DynamicPage from './pages/DynamicPage';
import ContactPage from './pages/ContactPage';
import AdminPanel from './admin/AdminPanel';
import './App.css';

function App() {
  return (
    <div className="App">
      <ScrollManager />
      <Routes>
        <Route path="/admin-panel/*" element={<AdminPanel />} />
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/services" element={<DynamicPage />} />
                <Route path="/team" element={<DynamicPage />} />
                <Route path="/blog" element={<DynamicPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/page/:slug" element={<DynamicPage />} />
              </Routes>
              <Footer />
              <ScrollToTop />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
