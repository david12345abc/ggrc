import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import './AboutUs.css';

const highlights = [
  'Time-lapse Embryoscope',
  'Preimplantation Genetic Testing (PGT)',
  'Cryopreservation of eggs and sperm',
  'Integration of Artificial Intelligence (AI) in IVF (IVF/ICSI)',
];

const AboutUs = () => {
  return (
    <section className="about" id="about">
      <div className="about__video-wrapper">
        <div className="about__video-drop">
          <img
            src="/images/about-interview.png"
            alt="GGRC Armenia Interview"
            className="about__video-img"
          />
        </div>
      </div>

      <div className="about__content">
        <div className="container">
          <h2 className="about__title">ABOUT US</h2>
          <p className="about__text about__text--bold">
            GGRC Armenia is the Armenian branch of the internationally renowned
            Georgian-German Reproductive Center (GGRC), a leading fertility
            clinic that has helped countless families fulfill their dream of
            becoming parents.
          </p>
          <p className="about__text">
            Our core mission is to make advanced, high-quality, and effective
            reproductive services accessible to everyone facing infertility
            challenges.
          </p>

          <ul className="about__list">
            {highlights.map((item, index) => (
              <li key={index} className="about__list-item">
                <FiCheckCircle className="about__check-icon" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <a href="#services" className="about__btn">
            About Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
