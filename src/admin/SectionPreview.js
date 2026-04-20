import React from 'react';
import getIcon from '../utils/iconMap';
import { getImgPosition } from '../utils/imgPosition';

const SectionPreview = ({ section }) => {
  const items = section.items || [];
  const type = section.section_type;

  if (type === 'hero') {
    const img = items[0];
    return (
      <div className="sp sp--hero">
        <div className="sp--hero__text">
          <h2 className="sp--hero__title">{section.title}</h2>
        </div>
        {img?.image_url && (
          <img
            src={img.image_url}
            alt=""
            className="sp--hero__img"
            style={getImgPosition(img) ? { objectPosition: getImgPosition(img) } : undefined}
          />
        )}
      </div>
    );
  }

  if (type === 'text_block') {
    const s = section.settings || {};
    const style = {};
    if (s.font_size) style.fontSize = `${Math.min(s.font_size, 18)}px`;
    if (s.font_weight) style.fontWeight = s.font_weight;
    if (s.font_family) style.fontFamily = s.font_family;
    if (s.text_color) style.color = s.text_color;
    if (s.text_align) style.textAlign = s.text_align;
    const body = s.body || '';
    const hasTags = /<\/?[a-zA-Z][\s\S]*?>/.test(body);
    const renderHtml = s.body_format === 'html' || hasTags;
    return (
      <div className="sp sp--text-block" style={s.bg_color ? { background: s.bg_color } : undefined}>
        {renderHtml ? (
          <div
            className="sp--text-block__body dp-text-block__body dp-text-block__body--html"
            style={Object.keys(style).length ? style : undefined}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        ) : (
          <p className="sp--text-block__body" style={Object.keys(style).length ? style : undefined}>
            {body.substring(0, 200)}{body.length > 200 ? '...' : ''}
          </p>
        )}
      </div>
    );
  }

  if (['features_carousel', 'why_choose_us'].includes(type)) {
    const isPurple = type === 'why_choose_us';
    return (
      <div className={`sp sp--icon-cards ${isPurple ? 'sp--icon-cards--purple' : ''}`}>
        {items.map((item) => {
          const IconComp = getIcon(item.icon_name);
          return (
            <div key={item.id} className="sp__icon-card">
              {IconComp && <div className="sp__icon-circle"><IconComp /></div>}
              <strong className="sp__icon-title">{item.title}</strong>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'team') {
    return (
      <div className="sp sp--team">
        {items.map((item) => (
          <div key={item.id} className="sp__team-card">
            <div className="sp__team-img-wrap">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt=""
                  className="sp__team-img"
                  style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined}
                />
              ) : (
                <div className="sp__team-placeholder" />
              )}
            </div>
            <div className="sp__team-info">
              <strong>{item.title}</strong>
              {item.description && <span>{item.description}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'blog') {
    return (
      <div className="sp sp--blog">
        {items.map((item) => (
          <div key={item.id} className="sp__blog-card">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="sp__blog-img"
                style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined}
              />
            ) : (
              <div className="sp__blog-placeholder" />
            )}
            <div className="sp__blog-body">
              <strong>{item.title}</strong>
              {item.link_text && <span className="sp__blog-link">{item.link_text}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'steps') {
    return (
      <div className="sp sp--steps">
        {items.map((item) => (
          <div key={item.id} className="sp__step-card">
            <span className="sp__step-num">{item.extra_data?.number || ''}</span>
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="sp__step-img"
                style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined}
              />
            ) : (
              <div className="sp__step-placeholder" />
            )}
            <strong>{item.title}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'services') {
    return (
      <div className="sp sp--services">
        {items.map((item) => (
          <div key={item.id} className="sp__service-card">
            {item.image_url && (
              <img
                src={item.image_url}
                alt=""
                className="sp__service-img"
                style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined}
              />
            )}
            <strong className="sp__service-title">{item.title}</strong>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'testimonials') {
    return (
      <div className="sp sp--testimonials">
        {items.map((item) => (
          <div key={item.id} className="sp__testimonial-card">
            <p>"{item.description?.substring(0, 120)}..."</p>
            <span className="sp__testimonial-author">— {item.extra_data?.author}</span>
          </div>
        ))}
      </div>
    );
  }

  if (['card_grid', 'card_carousel'].includes(type)) {
    return (
      <div className="sp sp--blog">
        {items.map((item) => (
          <div key={item.id} className="sp__blog-card">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="sp__blog-img"
                style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined}
              />
            ) : (
              <div className="sp__blog-placeholder" />
            )}
            <div className="sp__blog-body">
              <strong>{item.title}</strong>
              {item.description && <span>{item.description.substring(0, 50)}</span>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (['about_hero_text', 'about_conference', 'about_teaser', 'about_values', 'about_tech'].includes(type)) {
    return (
      <div className="sp sp--about-text">
        <h3>{section.title}</h3>
        {section.settings?.lead && <p>{section.settings.lead.substring(0, 150)}...</p>}
        {section.settings?.bold_text && <p><strong>{section.settings.bold_text.substring(0, 100)}...</strong></p>}
        {items.length > 0 && <span className="sp--about-text__count">{items.length} items</span>}
      </div>
    );
  }

  return (
    <div className="sp sp--about-text">
      <h3>{section.title || section.section_type}</h3>
      <span className="sp--about-text__count">{items.length} items</span>
    </div>
  );
};

export default SectionPreview;
