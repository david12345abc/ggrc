import React from 'react';
import getIcon from '../../utils/iconMap';
import { buildSectionStyle, buildTitleStyle, buildGridStyle, getGridClassName } from '../../utils/sectionStyles';
import './WhyChooseUs.css';

const WhyChooseUs = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="why-choose" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="why-choose__title" style={buildTitleStyle(data)}>{data.title}</h2>
        <div className={getGridClassName(data, 'why-choose__grid')} style={buildGridStyle(data)}>
          {items.map((item) => {
            const IconComp = getIcon(item.icon_name);
            return (
              <div key={item.id} className="why-choose__card">
                <div className="why-choose__icon">
                  {IconComp ? <IconComp /> : null}
                </div>
                <h3 className="why-choose__card-title">{item.title}</h3>
                <p className="why-choose__card-desc">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
