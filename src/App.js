import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import FeaturesSlider from './components/FeaturesSlider/FeaturesSlider';
import AboutUs from './components/AboutUs/AboutUs';
import Services from './components/Services/Services';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import Team from './components/Team/Team';
import Steps from './components/Steps/Steps';
import Testimonials from './components/Testimonials/Testimonials';
import Blog from './components/Blog/Blog';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <FeaturesSlider />
      <AboutUs />
      <Services />
      <WhyChooseUs />
      <Team />
      <Steps />
      <Testimonials />
      <Blog />
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
