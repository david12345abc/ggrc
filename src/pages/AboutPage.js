import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { ABOUT_PAGE_YOUTUBE_VIDEO_ID } from '../siteInfo';
import './AboutPage.css';

const VALUES = [
  {
    title: 'Professional Excellence',
    text:
      'We bring together specialists with international experience who follow the latest advancements in reproductive medicine.',
  },
  {
    title: 'Innovation',
    text:
      'We apply cutting-edge technologies, including artificial intelligence, to enhance the accuracy and effectiveness of treatment.',
  },
  {
    title: 'Accessibility',
    text:
      'We believe that high-quality reproductive healthcare should be accessible to everyone. That’s why we offer financial support programs to ease the burden for couples.',
  },
  {
    title: 'Education & Development',
    text:
      'Through conferences, seminars, and workshops, we aim to enrich the medical community in Armenia and across the region.',
  },
  {
    title: 'International Collaboration',
    text:
      'We build strong bridges between local and global experts to foster collective progress in reproductive medicine.',
  },
];

const TECH_ITEMS = [
  {
    title: 'Time-lapse Embryoscope',
    text:
      'An innovative embryo incubation system that continuously monitors embryo development 24/7, allowing embryologists to select the highest-quality embryo for implantation.',
  },
  {
    title: 'Preimplantation Genetic Testing (PGT)',
    text:
      'A genetic screening method for embryos that increases the chances of a healthy pregnancy and reduces the risk of genetic disorders.',
  },
  {
    title: 'Cryopreservation of eggs and sperm',
    text:
      'A biological preservation method that allows individuals and couples to safeguard their reproductive potential for the future.',
  },
  {
    title: 'Integration of Artificial Intelligence (AI) in IVF (IVF/ICSI)',
    text:
      'A unique innovation in the region, where AI systems are applied throughout all stages of the IVF process. This technology significantly streamlines clinical decision-making while enhancing treatment success rates.',
  },
];

const CONFERENCE_BULLETS = [
  'On March 9, 2025, GGRC Armenia hosted its first scientific-medical conference, bringing together leading reproductive medicine experts from across the region. This milestone event marked a significant step not only in GGRC Armenia’s growth but also in strengthening cooperation between local and international medical communities.',
  'Throughout the conference, participants discussed the latest advancements in reproductive medicine, innovative technologies, and future perspectives for infertility treatment. The event played a key role in fostering knowledge exchange and enhancing the quality of reproductive care across the region.',
  'GGRC Armenia emphasizes that scientific and educational initiatives are just as vital as the delivery of medical services. The center is committed to advancing medical education in Armenia, equipping the local medical community with cutting-edge knowledge and skills.',
];

const CheckList = ({ items }) => (
  <ul className="about-page__check-list">
    {items.map((item) => (
      <li key={item.title} className="about-page__check-item">
        <FiCheck className="about-page__check-icon" aria-hidden />
        <div>
          <strong className="about-page__check-title">{item.title}</strong>
          <span className="about-page__check-dash"> — </span>
          <span className="about-page__check-text">{item.text}</span>
        </div>
      </li>
    ))}
  </ul>
);

const AboutPage = () => {
  const embedSrc =
    ABOUT_PAGE_YOUTUBE_VIDEO_ID &&
    `https://www.youtube-nocookie.com/embed/${ABOUT_PAGE_YOUTUBE_VIDEO_ID}?rel=0`;

  return (
    <main className="about-page">
      <nav className="about-page__breadcrumb" aria-label="Breadcrumb">
        <div className="container about-page__breadcrumb-inner">
          <Link to="/" className="about-page__breadcrumb-link">
            HOME
          </Link>
          <span className="about-page__breadcrumb-sep" aria-hidden>
            {' '}
            &gt;{' '}
          </span>
          <span className="about-page__breadcrumb-current">ABOUT US</span>
        </div>
      </nav>

      <section className="about-page__section about-page__section--white">
        <div className="container about-page__narrow">
          <p className="about-page__kicker">ABOUT US</p>
          <h1 className="about-page__hero-title">
            IN TRUSTED HANDS – STEP BY STEP TOWARD THE MIRACLE OF NEW LIFE
          </h1>
          <p className="about-page__lead">
            With the growing demand for innovative reproductive treatments in Armenia, GGRC Armenia, a
            Georgian-German-Armenian international reproductive center, brings the latest generation of
            technologies, including those powered by artificial intelligence, along with a fully
            personalized approach to care. Our newly opened clinic is equipped with cutting-edge medical
            technologies and is fully focused on diagnostics, in vitro fertilization (IVF/ICSI), treatment
            of both female and male infertility, and the promotion of reproductive health.
          </p>
        </div>
      </section>

      <section className="about-page__section about-page__section--white">
        <div className="container about-page__narrow">
          <h2 className="about-page__section-title">OUR VALUES</h2>
          <CheckList items={VALUES} />
        </div>
      </section>

      <section className="about-page__section about-page__section--white">
        <div className="container about-page__narrow">
          <div className="about-page__media">
            <img
              src="/images/about-woman-seated.png"
              alt="GGRC Armenia medical professional"
              className="about-page__media-img"
            />
          </div>
          <h2 className="about-page__section-title about-page__section-title--left">
            INNOVATIVE TECHNOLOGIES FOR MAXIMUM EFFECTIVENESS
          </h2>
          <p className="about-page__body">
            At GGRC Armenia, we confidently claim to be shaping the future of reproductive medicine by
            combining years of clinical experience with cutting-edge AI technologies. Our mission is not
            only to replace uncertainty with hope but also to offer couples the most effective,
            personalized, and scientifically grounded infertility treatments available. We firmly believe
            that the future of in vitro fertilization (IVF/ICSI) lies at the intersection of advanced
            medical expertise, deep knowledge, and next-generation technologies. Through these
            innovations, GGRC Armenia is setting new standards in the Armenian reproductive healthcare
            landscape.
          </p>
          <CheckList items={TECH_ITEMS} />
        </div>
      </section>

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
                href="https://www.youtube.com/channel/UCvhOxd4DL1kUZLOPJV-K-aA"
                className="about-page__video-fallback"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/blog/interview-tv.png"
                  alt="Television feature about GGRC Armenia — open on YouTube"
                  className="about-page__video-fallback-img"
                />
                <span className="about-page__video-fallback-label">Watch on YouTube</span>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="about-page__section about-page__section--muted">
        <div className="container about-page__narrow">
          <h2 className="about-page__section-title about-page__section-title--left">
            A NEW CHAPTER IN INTERNATIONAL SCIENTIFIC AND MEDICAL COLLABORATION IN ARMENIA
          </h2>
          <ul className="about-page__bullet-list">
            {CONFERENCE_BULLETS.map((text, index) => (
              <li key={index} className="about-page__bullet-item">
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
