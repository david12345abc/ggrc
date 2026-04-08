import React from 'react';
import Hero from '../components/Hero/Hero';
import FeaturesSlider from '../components/FeaturesSlider/FeaturesSlider';
import AboutUs from '../components/AboutUs/AboutUs';
import Services from '../components/Services/Services';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Team from '../components/Team/Team';
import Steps from '../components/Steps/Steps';
import Testimonials from '../components/Testimonials/Testimonials';
import Blog from '../components/Blog/Blog';

const HomePage = () => (
  <>
    <Hero />
    <FeaturesSlider />
    <AboutUs />
    <Services />
    <WhyChooseUs />
    <Team />
    <Steps />
    <Testimonials />
    <Blog />
  </>
);

export default HomePage;
