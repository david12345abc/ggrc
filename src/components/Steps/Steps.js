import React from 'react';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle, buildGridStyle, getGridClassName } from '../../utils/sectionStyles';
import './Steps.css';

const Steps = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="steps" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="section-title" style={buildTitleStyle(data)}>{data.title}</h2>

        <div className={getGridClassName(data, 'steps__grid')} style={buildGridStyle(data)}>
          {items.map((step) => (
            <div key={step.id} className="steps__card">
              <span className="steps__number">{step.extra_data?.number}</span>
              <div className="steps__card-img">
                {step.image_url && <img src={step.image_url} alt={step.title} style={getImgPosition(step) ? { objectPosition: getImgPosition(step) } : undefined} />}
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
