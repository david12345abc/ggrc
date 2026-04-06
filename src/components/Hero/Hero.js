import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      <div className="hero__bg">
        <div className="hero__content">
          <div className="hero__row">
            <h1 className="hero__title">
              THE DREAM OF PARENTHOOD COMES TRUE HERE
            </h1>
            <div className="hero__desktop-photo">
              <img
                src="/images/doctors-hero.png"
                alt="GGRC Armenia Doctors"
                className="hero__desktop-img"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hero__image hero__image--mobile">
        <img
          src="/images/doctors-hero.png"
          alt="GGRC Armenia Doctors"
          className="hero__img"
        />
      </div>
    </section>
  );
};

export default Hero;
