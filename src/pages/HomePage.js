import React from 'react';
import usePageData from '../hooks/usePageData';
import Hero from '../components/Hero/Hero';
import FeaturesSlider from '../components/FeaturesSlider/FeaturesSlider';
import AboutUs from '../components/AboutUs/AboutUs';
import Services from '../components/Services/Services';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Team from '../components/Team/Team';
import Steps from '../components/Steps/Steps';
import Testimonials from '../components/Testimonials/Testimonials';
import Blog from '../components/Blog/Blog';

const HomePage = () => {
  const { getSection, loading } = usePageData('home');

  if (loading) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  return (
    <>
      <Hero data={getSection('hero')} />
      <FeaturesSlider data={getSection('features_carousel')} />
      <AboutUs data={getSection('about_teaser')} />
      <Services data={getSection('services')} />
      <WhyChooseUs data={getSection('why_choose_us')} />
      <Team data={getSection('team')} />
      <Steps data={getSection('steps')} />
      <Testimonials data={getSection('testimonials')} />
      <Blog data={getSection('blog')} />
    </>
  );
};

export default HomePage;
