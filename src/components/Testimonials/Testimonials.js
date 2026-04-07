import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import './Testimonials.css';

const testimonials = [
  {
    text: "I had PCOS and hormonal disorders. We had attempted IVF multiple times in Russia, but without success. At GGRC Armenia, the impossible became possible. I'm honestly impressed by the level of professionalism in such a small country.",
    author: 'Patient from Russia',
  },
  {
    text: 'The team at GGRC Armenia treated us with such warmth and care. After years of trying, we finally became parents. We are forever grateful for their expertise and dedication.',
    author: 'International Patient',
  },
  {
    text: 'From the very first consultation, we felt that we were in good hands. The doctors explained every step clearly and gave us hope when we had almost given up.',
    author: 'Patient from CIS',
  },
];

const testimonialBg = `${process.env.PUBLIC_URL || ''}/images/neural-network.jpg`;

const Testimonials = () => {
  return (
    <section
      className="testimonials"
      style={{ backgroundImage: `url(${testimonialBg})` }}
    >
      <div className="testimonials__overlay" aria-hidden="true" />
      <div className="container testimonials__inner">
        <h2 className="testimonials__title">PATIENTS ABOUT GGRC ARMENIA</h2>

        <div className="testimonials__grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonials__card">
              <FaQuoteLeft className="testimonials__quote-icon" />
              <p className="testimonials__text">{testimonial.text}</p>
              <span className="testimonials__author">
                — {testimonial.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
