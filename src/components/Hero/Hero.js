import React from 'react';
import { Link } from 'react-router-dom';
import { getImgPosition } from '../../utils/imgPosition';
import './Hero.css';

const Hero = ({ data }) => {
  if (!data) return null;
  const s = data.settings || {};
  const heroImage = data.items?.[0];
  const imgSrc = heroImage?.image_url || '/images/doctors-hero.png';
  const objPos = getImgPosition(heroImage);
  const isServiceDetail = Boolean(s.service_detail_hero);

  const bgStyle = {};
  if (s.bg_color) bgStyle.backgroundColor = s.bg_color;
  if (data.background_image_url) {
    bgStyle.backgroundImage = `url(${data.background_image_url})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = 'center';
  }
  if (isServiceDetail && heroImage?.image_url) {
    bgStyle.backgroundImage = `url(${heroImage.image_url})`;
    bgStyle.backgroundSize = 'cover';
    bgStyle.backgroundPosition = objPos || 'center';
  }

  const titleStyle = {};
  if (s.font_size) titleStyle.fontSize = `${s.font_size}px`;
  if (s.font_weight) titleStyle.fontWeight = s.font_weight;
  if (s.font_family) titleStyle.fontFamily = s.font_family;
  if (s.text_color) titleStyle.color = s.text_color;
  if (s.title_color) titleStyle.color = s.title_color;
  if (s.text_align) titleStyle.textAlign = s.text_align;

  const sectionStyle = {};
  if (s.margin_bottom) sectionStyle.marginBottom = `${s.margin_bottom}px`;

  return (
    <section
      className={`hero${isServiceDetail ? ' hero--service-detail' : ''}`}
      id="home"
      style={Object.keys(sectionStyle).length ? sectionStyle : undefined}
    >
      <div className="hero__bg" style={Object.keys(bgStyle).length ? bgStyle : undefined}>
        <div className="container hero__inner">
          {s.service_breadcrumb && (
            <nav className="hero__breadcrumb" aria-label="Breadcrumb">
              <Link to="/" className="hero__breadcrumb-link">HOME</Link>
              <span className="hero__breadcrumb-sep" aria-hidden> &gt; </span>
              <span className="hero__breadcrumb-current">SERVICE DETAILS</span>
            </nav>
          )}
          <div className="hero__row">
            <h1 className="hero__title" style={Object.keys(titleStyle).length ? titleStyle : undefined}>
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="hero__subtitle">{data.subtitle}</p>
            )}
            {!isServiceDetail && (
              <div className="hero__desktop-photo">
                <img src={imgSrc} alt="" className="hero__desktop-img" style={objPos ? { objectPosition: objPos } : undefined} />
              </div>
            )}
          </div>
        </div>
      </div>
      {!isServiceDetail && (
        <div className="hero__image hero__image--mobile">
          <img src={imgSrc} alt="" className="hero__img" style={objPos ? { objectPosition: objPos } : undefined} />
        </div>
      )}
    </section>
  );
};

export default Hero;
