import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import usePageData from '../hooks/usePageData';
import { getImgPosition } from '../utils/imgPosition';
import { buildSectionStyle, buildTitleStyle } from '../utils/sectionStyles';
import Hero from '../components/Hero/Hero';
import FeaturesSlider from '../components/FeaturesSlider/FeaturesSlider';
import AboutUs from '../components/AboutUs/AboutUs';
import Services from '../components/Services/Services';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Team from '../components/Team/Team';
import Steps from '../components/Steps/Steps';
import Testimonials from '../components/Testimonials/Testimonials';
import Blog from '../components/Blog/Blog';
import CardCarousel from '../components/CardCarousel/CardCarousel';
import './DynamicPage.css';

const SECTION_RENDERERS = {
  hero: (data) => <Hero key={data.id} data={data} />,
  features_carousel: (data) => <FeaturesSlider key={data.id} data={data} />,
  about_teaser: (data) => <AboutUs key={data.id} data={data} />,
  services: (data) => <Services key={data.id} data={data} />,
  why_choose_us: (data) => <WhyChooseUs key={data.id} data={data} />,
  team: (data) => <Team key={data.id} data={data} />,
  steps: (data) => <Steps key={data.id} data={data} />,
  testimonials: (data) => <Testimonials key={data.id} data={data} />,
  blog: (data) => <Blog key={data.id} data={data} />,
  text_block: (data) => <TextBlock key={data.id} data={data} />,
  card_grid: (data) => <CardGrid key={data.id} data={data} />,
  card_carousel: (data) => <CardCarousel key={data.id} data={data} />,
  video_block: (data) => <VideoBlock key={data.id} data={data} />,
};

const TextBlock = ({ data }) => {
  if (!data) return null;
  const s = data.settings || {};
  const textStyle = {};
  if (s.font_size) textStyle.fontSize = `${s.font_size}px`;
  if (s.font_weight) textStyle.fontWeight = s.font_weight;
  if (s.font_family) textStyle.fontFamily = s.font_family;
  if (s.text_color) textStyle.color = s.text_color;
  if (s.text_align) textStyle.textAlign = s.text_align;
  const hasTextStyle = Object.keys(textStyle).length > 0;
  const bodyIsHtml = s.body_format === 'html';

  return (
    <section className="dp-text-block" style={buildSectionStyle(data)}>
      <div className="container">
        {s.body && bodyIsHtml && (
          <div
            className="dp-text-block__body dp-text-block__body--html"
            style={hasTextStyle ? textStyle : undefined}
            dangerouslySetInnerHTML={{ __html: s.body }}
          />
        )}
        {s.body && !bodyIsHtml && (
          <div
            className="dp-text-block__body"
            style={hasTextStyle ? textStyle : undefined}
          >
            {s.body}
          </div>
        )}
      </div>
    </section>
  );
};

function extractVideoId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const VideoBlock = ({ data }) => {
  if (!data) return null;
  const s = data.settings || {};
  const videoId = extractVideoId(s.video_url);
  if (!videoId) return null;

  return (
    <section className="dp-video-block" style={buildSectionStyle(data)}>
      <div className="container">
        {data.title && <h2 className="dp-video-block__title" style={buildTitleStyle(data)}>{data.title}</h2>}
        <div className="dp-video-block__wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={data.title || 'Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="dp-video-block__iframe"
          />
        </div>
      </div>
    </section>
  );
};

const GRID_ALIGN_MAP = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
  stretch: 'stretch',
};

const CardGrid = ({ data }) => {
  if (!data) return null;
  const items = data.items || [];
  const cardsAlign = data.settings?.cards_align || 'stretch';
  const gridStyle = {};
  if (cardsAlign !== 'stretch') {
    gridStyle.justifyContent = GRID_ALIGN_MAP[cardsAlign];
  }

  return (
    <section className="dp-card-grid" style={buildSectionStyle(data)}>
      <div className="container">
        {data.title && <h2 className="dp-card-grid__title" style={buildTitleStyle(data)}>{data.title}</h2>}
        {data.subtitle && <p className="dp-card-grid__subtitle">{data.subtitle}</p>}
        <div
          className={`dp-card-grid__grid ${cardsAlign !== 'stretch' ? 'dp-card-grid__grid--flex' : ''}`}
          style={Object.keys(gridStyle).length ? gridStyle : undefined}
        >
          {items.map((item) => (
            <div key={item.id} className="dp-card-grid__card">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="dp-card-grid__img" style={getImgPosition(item) ? { objectPosition: getImgPosition(item) } : undefined} />
              )}
              <div className="dp-card-grid__body">
                {item.title && <h3 className="dp-card-grid__card-title">{item.title}</h3>}
                {item.description && <p className="dp-card-grid__desc">{item.description}</p>}
                {item.link_url && item.link_text && (
                  <a href={item.link_url} className="dp-card-grid__link">{item.link_text}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PAGE_TITLES = {
  services: { en: 'Services', ru: '\u0423\u0441\u043b\u0443\u0433\u0438', am: '\u053e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580' },
  team: { en: 'Our Team', ru: '\u041d\u0430\u0448\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0430', am: '\u0544\u0565\u0580 \u0569\u056b\u0574\u0568' },
  blog: { en: 'Blog', ru: '\u0411\u043b\u043e\u0433', am: '\u0532\u056c\u0578\u0563' },
  contact: { en: 'Contact', ru: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b', am: '\u053f\u0561\u057a' },
};

const DynamicPage = () => {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  const slug = paramSlug || location.pathname.replace(/^\//, '').split('/')[0] || 'home';
  const { sections, loading } = usePageData(slug);

  if (loading) return <div style={{ minHeight: '100vh' }} />;

  const breadcrumbTitle = PAGE_TITLES[slug]?.en || slug;
  const isServiceDetailPage = /^service-/.test(slug);

  return (
    <main className={`dynamic-page${isServiceDetailPage ? ' dynamic-page--service-detail' : ''}`}>
      {!isServiceDetailPage && (
        <nav className="dynamic-page__breadcrumb" aria-label="Breadcrumb">
          <div className="container dynamic-page__breadcrumb-inner">
            <Link to="/" className="dynamic-page__breadcrumb-link">HOME</Link>
            <span className="dynamic-page__breadcrumb-sep" aria-hidden> &gt; </span>
            <span className="dynamic-page__breadcrumb-current">{breadcrumbTitle.toUpperCase()}</span>
          </div>
        </nav>
      )}

      {sections.length === 0 && (
        <div className="dynamic-page__empty">
          <p>This page has no content yet.</p>
        </div>
      )}

      {sections.map((section) => {
        const renderer = SECTION_RENDERERS[section.section_type];
        if (renderer) return renderer(section);
        return (
          <section key={section.id} className="dp-text-block">
            <div className="container">
              {section.title && <h2 className="dp-text-block__title">{section.title}</h2>}
              {section.subtitle && <p className="dp-text-block__subtitle">{section.subtitle}</p>}
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default DynamicPage;
