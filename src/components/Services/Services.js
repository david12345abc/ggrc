import React from 'react';
import { Link } from 'react-router-dom';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import './Services.css';

const ServiceCard = ({ item }) => {
  const inner = (
    <>
      {item.image_url && (
        <div className="services__single-img">
          <img src={item.image_url} alt={item.title} style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined} />
        </div>
      )}
      <div className="services__single-body">
        <h3 className="services__single-title">{item.title}</h3>
        {item.description ? (
          <p className="services__single-desc">{item.description}</p>
        ) : null}
      </div>
    </>
  );

  if (item.link_url) {
    return (
      <Link to={item.link_url} className="services__single services__single--link">
        {inner}
      </Link>
    );
  }

  return <div className="services__single">{inner}</div>;
};

const Services = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="services" id="services" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="section-title" style={buildTitleStyle(data)}>{data.title}</h2>
        {data.subtitle && <p className="section-subtitle">{data.subtitle}</p>}

        {items.map((item) => (
          <ServiceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Services;
