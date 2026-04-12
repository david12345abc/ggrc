import React from 'react';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import './Services.css';

const Services = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="services" id="services" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="section-title" style={buildTitleStyle(data)}>{data.title}</h2>
        {data.subtitle && <p className="section-subtitle">{data.subtitle}</p>}

        {items.map((item) => (
          <div key={item.id} className="services__single">
            {item.image_url && (
              <div className="services__single-img">
                <img src={item.image_url} alt={item.title} style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined} />
              </div>
            )}
            <h3 className="services__single-title">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
