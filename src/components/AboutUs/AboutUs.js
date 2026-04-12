import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import './AboutUs.css';

const AboutUs = ({ data }) => {
  if (!data) return null;

  const settings = data.settings || {};
  const items = data.items || [];
  const imageItem = items.find((i) => !i.extra_data?.type);
  const highlights = items.filter((i) => i.extra_data?.type === 'highlight');
  const imgSrc = imageItem?.image_url || '/images/about-interview.png';

  return (
    <section className="about" id="about" style={buildSectionStyle(data)}>
      <div className="container about__layout">
        <div className="about__video-wrapper">
          <div className="about__video-drop">
            <img src={imgSrc} alt="GGRC Armenia Interview" className="about__video-img" style={getImgPosition(imageItem) ? { objectPosition: getImgPosition(imageItem) } : undefined} />
          </div>
        </div>

        <div className="about__content">
          <h2 className="about__title" style={buildTitleStyle(data)}>{data.title}</h2>
          {settings.bold_text && (
            <p className="about__text about__text--bold">{settings.bold_text}</p>
          )}
          {settings.text && (
            <p className="about__text">{settings.text}</p>
          )}

          <ul className="about__list">
            {highlights.map((item) => (
              <li key={item.id} className="about__list-item">
                <FiCheckCircle className="about__check-icon" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>

          {settings.button_link && (
            <Link to={settings.button_link} className="about__btn">
              {settings.button_text || 'About Us'}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
