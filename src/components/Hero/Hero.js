import React from 'react';
import { getImgPosition } from '../../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../../utils/sectionStyles';
import './Hero.css';

const Hero = ({ data }) => {
  if (!data) return null;
  const heroImage = data.items?.[0];
  const imgSrc = heroImage?.image_url || '/images/doctors-hero.png';
  const objPos = getImgPosition(heroImage);

  return (
    <section className="hero" id="home" style={buildSectionStyle(data)}>
      <div className="hero__bg">
        <div className="container hero__inner">
          <div className="hero__row">
            <h1 className="hero__title" style={buildTitleStyle(data)}>{data.title}</h1>
            <div className="hero__desktop-photo">
              <img src={imgSrc} alt="GGRC Armenia Doctors" className="hero__desktop-img" style={objPos ? { objectPosition: objPos } : undefined} />
            </div>
          </div>
        </div>
      </div>
      <div className="hero__image hero__image--mobile">
        <img src={imgSrc} alt="GGRC Armenia Doctors" className="hero__img" style={objPos ? { objectPosition: objPos } : undefined} />
      </div>
    </section>
  );
};

export default Hero;
