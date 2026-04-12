import React from 'react';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle, buildGridStyle, getGridClassName } from '../../utils/sectionStyles';
import './Team.css';

const Team = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];

  return (
    <section className="team" id="team" style={buildSectionStyle(data)}>
      <div className="container">
        <h2 className="section-title" style={buildTitleStyle(data)}>{data.title}</h2>
        {data.subtitle && <p className="section-subtitle">{data.subtitle}</p>}

        <div className={getGridClassName(data, 'team__grid')} style={buildGridStyle(data)}>
          {items.map((member) => (
            <div key={member.id} className="team__card">
              <div className="team__card-img">
                {member.image_url && (
                  <img src={member.image_url} alt={member.title} style={getImgPosition(member) ? { objectPosition: getImgPosition(member) } : undefined} />
                )}
              </div>
              <div className="team__card-info">
                <h3 className="team__card-name">{member.title}</h3>
                <p className="team__card-role">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
