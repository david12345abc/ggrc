import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import usePageData from '../hooks/usePageData';
import useSiteSettings from '../hooks/useSiteSettings';
import { getImgPosition } from '../utils/imgPosition';
import './AboutPage.css';

const CheckList = ({ items }) => (
  <ul className="about-page__check-list">
    {items.map((item) => (
      <li key={item.id} className="about-page__check-item">
        <FiCheck className="about-page__check-icon" aria-hidden />
        <div>
          <strong className="about-page__check-title">{item.title}</strong>
          <span className="about-page__check-dash"> — </span>
          <span className="about-page__check-text">{item.description}</span>
        </div>
      </li>
    ))}
  </ul>
);

const AboutPage = () => {
  const { getSection, loading } = usePageData('about');
  const siteSettings = useSiteSettings();

  if (loading) return <div style={{ minHeight: '100vh' }} />;

  const heroText = getSection('about_hero_text');
  const values = getSection('about_values');
  const tech = getSection('about_tech');
  const video = getSection('about_video');
  const conference = getSection('about_conference');

  const youtubeId = siteSettings?.youtube_video_id || video?.settings?.youtube_video_id;
  const embedSrc = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`
    : null;

  const techImage = tech?.items?.find((i) => i.extra_data?.type === 'media');
  const techItems = tech?.items?.filter((i) => i.extra_data?.type !== 'media') || [];

  return (
    <main className="about-page">
      <nav className="about-page__breadcrumb" aria-label="Breadcrumb">
        <div className="container about-page__breadcrumb-inner">
          <Link to="/" className="about-page__breadcrumb-link">HOME</Link>
          <span className="about-page__breadcrumb-sep" aria-hidden> &gt; </span>
          <span className="about-page__breadcrumb-current">ABOUT US</span>
        </div>
      </nav>

      {heroText && (
        <section className="about-page__section about-page__section--white">
          <div className="container about-page__narrow">
            <p className="about-page__kicker">{heroText.settings?.kicker}</p>
            <h1 className="about-page__hero-title">{heroText.title}</h1>
            <p className="about-page__lead">{heroText.settings?.lead}</p>
          </div>
        </section>
      )}

      {values && (
        <section className="about-page__section about-page__section--white">
          <div className="container about-page__narrow">
            <h2 className="about-page__section-title">{values.title}</h2>
            <CheckList items={values.items || []} />
          </div>
        </section>
      )}

      {tech && (
        <section className="about-page__section about-page__section--white">
          <div className="container about-page__narrow">
            {techImage?.image_url && (
              <div className="about-page__media">
                <img
                  src={techImage.image_url}
                  alt="GGRC Armenia medical professional"
                  className="about-page__media-img"
                  style={getImgPosition(techImage) ? { objectPosition: getImgPosition(techImage) } : undefined}
                />
              </div>
            )}
            <h2 className="about-page__section-title about-page__section-title--left">
              {tech.title}
            </h2>
            {tech.settings?.body && (
              <p className="about-page__body">{tech.settings.body}</p>
            )}
            <CheckList items={techItems} />
          </div>
        </section>
      )}

      {video && (
        <section className="about-page__section about-page__section--video">
          <div className="container">
            <div className="about-page__video-shell">
              {embedSrc ? (
                <iframe
                  title="GGRC Armenia on Armenian TV"
                  src={embedSrc}
                  className="about-page__iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <a
                  href={video.settings?.youtube_channel || '#'}
                  className="about-page__video-fallback"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {video.settings?.fallback_image && (
                    <img
                      src={video.settings.fallback_image}
                      alt="Television feature about GGRC Armenia"
                      className="about-page__video-fallback-img"
                    />
                  )}
                  <span className="about-page__video-fallback-label">Watch on YouTube</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {conference && (
        <section className="about-page__section about-page__section--muted">
          <div className="container about-page__narrow">
            <h2 className="about-page__section-title about-page__section-title--left">
              {conference.title}
            </h2>
            <ul className="about-page__bullet-list">
              {(conference.items || []).map((item) => (
                <li key={item.id} className="about-page__bullet-item">
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  );
};

export default AboutPage;
