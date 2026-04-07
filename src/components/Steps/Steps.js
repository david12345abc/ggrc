import React from 'react';
import './Steps.css';

const steps = [
  {
    number: '01',
    title: 'Get an Appointment',
    description:
      'Start Your journey to parenthood with the guidance of experienced specialists',
    image: '/images/steps/step1.png',
  },
  {
    number: '02',
    title: 'Start Check-Up',
    description: "We'll carefully assess Your reproductive health",
    image: '/images/steps/step2.png',
  },
  {
    number: '03',
    title: 'Enjoy a Healthy Life',
    description:
      'Our goal is to help You build a complete and happy family',
    image: '/images/steps/step3.png',
  },
];

const Steps = () => {
  return (
    <section className="steps">
      <div className="container">
        <h2 className="section-title">STEPS</h2>

        <div className="steps__grid">
          {steps.map((step, index) => (
            <div key={index} className="steps__card">
              <span className="steps__number">{step.number}</span>
              <div className="steps__card-img">
                <img src={step.image} alt={step.title} />
              </div>
              <h3 className="steps__card-title">{step.title}</h3>
              <p className="steps__card-desc">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
