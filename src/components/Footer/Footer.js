import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FiChevronUp } from 'react-icons/fi';
import useSiteSettings from '../../hooks/useSiteSettings';
import useLanguage from '../../hooks/useLanguage';
import './Footer.css';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const FOOTER_T = {
  en: {
    links: 'Links', home: 'Home', about: 'About us', services: 'Services', contact: 'Contact',
    rights: 'All rights reserved.', admin: 'Admin Panel',
  },
  ru: {
    links: '\u0421\u0441\u044b\u043b\u043a\u0438', home: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', about: '\u041e \u043d\u0430\u0441', services: '\u0423\u0441\u043b\u0443\u0433\u0438', contact: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',
    rights: '\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.', admin: '\u0410\u0434\u043c\u0438\u043d-\u043f\u0430\u043d\u0435\u043b\u044c',
  },
  am: {
    links: '\u0540\u0572\u0578\u0582\u043c\u0576\u0565\u0580', home: '\u0533\u043b\u056d\u0561\u057e\u043e\u0580', about: '\u0544\u0565\u0580 \u043c\u0561\u057d\u056b\u0576', services: '\u053e\u0561\u057c\u0561\u0575\u043e\u0582\u0569\u0575\u043e\u0582\u0576\u0576\u0565\u0580', contact: '\u053f\u0561\u057a',
    rights: '\u0532\u043e\u043b\u043e\u0580 \u056b\u0580\u0561\u057e\u043e\u0582\u0576\u0584\u0576\u0565\u0580\u0568 \u057a\u0561\u0577\u057f\u057a\u0561\u0576\u057e\u0561\u0571 \u0565\u0576.', admin: '\u053f\u0561\u057c\u0561\u057e\u0561\u0580\u043c\u0561\u0576 \u057e\u0561\u0570\u0561\u0576\u0561\u056f',
  },
};

const Footer = () => {
  const settings = useSiteSettings();
  const { language } = useLanguage();
  const t = FOOTER_T[language] || FOOTER_T.en;

  const address = settings?.address_short || 'Armenia Yerevan Abovyan 56/4';
  const phoneDisplay = settings?.phone_display || '+374 95520055 , +374 60530055';
  const email = settings?.email || 'ggrcarmenia@gmail.com';
  const socials = {
    instagram: settings?.instagram_url || 'https://instagram.com',
    linkedin: settings?.linkedin_url || 'https://linkedin.com',
    facebook: settings?.facebook_url || 'https://facebook.com',
  };
  const logoPurpleUrl = settings?.logo_purple_url || '/images/logo-purple.png';

  return (
    <footer className="footer" id="contact">
      <div className="footer__decor footer__decor--dots" aria-hidden="true" />
      <div className="footer__decor footer__decor--curves" aria-hidden="true" />

      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand-block">
            <div className="footer__brand-row">
              <img src={logoPurpleUrl} alt="GGRC Armenia" className="footer__logo-img" />
            </div>
            <div className="footer__socials">
              <a href={socials.instagram} className="footer__social" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <img src="/images/icons/instagram.png" alt="" />
              </a>
              <a href={socials.linkedin} className="footer__social" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <img src="/images/icons/linkedin.png" alt="" />
              </a>
              <a href={socials.facebook} className="footer__social" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <img src="/images/icons/facebook.png" alt="" />
              </a>
            </div>
          </div>

          <div className="footer__links-block">
            <h2 className="footer__section-title">{t.links}</h2>
            <nav className="footer__nav">
              <Link to="/" className="footer__link">{t.home}</Link>
              <Link to="/about" className="footer__link">{t.about}</Link>
              <Link to="/services" className="footer__link">{t.services}</Link>
              <Link to="/contact" className="footer__link">{t.contact}</Link>
            </nav>
          </div>

          <div className="footer__contact-block">
            <div className="footer__contact-head">
              <h2 className="footer__section-title">{t.contact}</h2>
              <button type="button" className="footer__to-top" onClick={scrollToTop} aria-label="Scroll to top">
                <FiChevronUp />
              </button>
            </div>
            <div className="footer__contact-rows">
              <div className="footer__contact-row">
                <FaMapMarkerAlt className="footer__contact-icon" aria-hidden />
                <span>{address}</span>
              </div>
              <div className="footer__contact-row">
                <FaPhoneAlt className="footer__contact-icon" aria-hidden />
                <span>{phoneDisplay}</span>
              </div>
              <div className="footer__contact-row">
                <FaEnvelope className="footer__contact-icon" aria-hidden />
                <a href={`mailto:${email}`} className="footer__contact-link">{email}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} GGRC Armenia. {t.rights}
            <span className="footer__admin-sep"> | </span>
            <Link to="/admin-panel" className="footer__admin-link">{t.admin}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
