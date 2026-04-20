import React from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';
import { getImgPosition } from '../../utils/imgPosition';
import './Hero.css';

const HERO_T = {
  en: { home: 'HOME', service: 'SERVICE DETAILS' },
  ru: { home: '\u0413\u041b\u0410\u0412\u041d\u0410\u042f', service: '\u041f\u041e\u0414\u0420\u041e\u0411\u041d\u041e \u041e\u0411 \u0423\u0421\u041b\u0423\u0413\u0415' },
  am: { home: '\u0533\u053c\u053d\u0531\u054e\u0548\u0550', service: '\u053e\u0531\u054c\u0531\u0545\u0548\u0552\u0539\u0545\u0531\u0546 \u0544\u0531\u0546\u0550\u0531\u0544\u0531\u054d\u0546\u0535\u0550' },
};

const Hero = ({ data }) => {
  const { language } = useLanguage();
  const t = HERO_T[language] || HERO_T.en;
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
              <Link to="/" className="hero__breadcrumb-link">{t.home}</Link>
              <span className="hero__breadcrumb-sep" aria-hidden> &gt; </span>
              <span className="hero__breadcrumb-current">{t.service}</span>
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
