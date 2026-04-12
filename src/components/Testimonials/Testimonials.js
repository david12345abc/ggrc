import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { buildSectionStyle, buildTitleStyle, buildGridStyle, getGridClassName } from '../../utils/sectionStyles';
import './Testimonials.css';

const Testimonials = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];
  const bgUrl = data.background_image_url;
  const baseStyle = buildSectionStyle(data) || {};
  if (bgUrl) baseStyle.backgroundImage = `url(${bgUrl})`;

  return (
    <section
      className="testimonials"
      style={Object.keys(baseStyle).length ? baseStyle : undefined}
    >
      <div className="testimonials__overlay" aria-hidden="true" />
      <div className="container testimonials__inner">
        <h2 className="testimonials__title" style={buildTitleStyle(data)}>{data.title}</h2>

        <div className={getGridClassName(data, 'testimonials__grid')} style={buildGridStyle(data)}>
          {items.map((t) => (
            <div key={t.id} className="testimonials__card">
              <FaQuoteLeft className="testimonials__quote-icon" />
              <p className="testimonials__text">{t.description}</p>
              <span className="testimonials__author">
                — {t.extra_data?.author}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
