import React from 'react';
import {
  FaAward,
  FaMicroscope,
  FaGlobeAmericas,
  FaHeart,
  FaUsers,
  FaPray,
} from 'react-icons/fa';
import './WhyChooseUs.css';

const reasons = [
  {
    icon: <FaAward />,
    title: 'Quality Care',
    desc: 'Our clinic upholds the highest standards of medical care and patient safety.',
  },
  {
    icon: <FaMicroscope />,
    title: 'Advanced Equipment',
    desc: 'We use cutting-edge medical technology and modern laboratory systems.',
  },
  {
    icon: <FaGlobeAmericas />,
    title: 'Multilingual Staff',
    desc: 'Our team speaks multiple languages to serve international patients.',
  },
  {
    icon: <FaHeart />,
    title: 'Personalized Care',
    desc: 'Each patient receives a customized treatment plan based on their needs.',
  },
  {
    icon: <FaUsers />,
    title: 'Emotional Support',
    desc: 'Comprehensive emotional and psychological support throughout your journey.',
  },
  {
    icon: <FaPray />,
    title: 'Cultural Sensitivity',
    desc: 'Deep understanding and respect for diverse cultural backgrounds.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose">
      <div className="container">
        <h2 className="why-choose__title">WHY CHOOSE US</h2>
        <div className="why-choose__grid">
          {reasons.map((reason, index) => (
            <div key={index} className="why-choose__card">
              <div className="why-choose__icon">{reason.icon}</div>
              <h3 className="why-choose__card-title">{reason.title}</h3>
              <p className="why-choose__card-desc">{reason.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
