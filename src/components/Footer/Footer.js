import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { FiChevronUp } from 'react-icons/fi';
import { SITE_CONTACT, SOCIAL_LINKS } from '../../siteInfo';
import './Footer.css';

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="footer__decor footer__decor--dots" aria-hidden="true" />
      <div className="footer__decor footer__decor--curves" aria-hidden="true" />

      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand-block">
            <div className="footer__brand-row">
              <img
                src="/images/logo-purple.png"
                alt="GGRC Armenia"
                className="footer__logo-img"
              />
            </div>
            <div className="footer__socials">
              <a
                href={SOCIAL_LINKS.instagram}
                className="footer__social"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/icons/instagram.png" alt="" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                className="footer__social"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/icons/linkedin.png" alt="" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                className="footer__social"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/icons/facebook.png" alt="" />
              </a>
            </div>
          </div>

          <div className="footer__links-block">
            <h2 className="footer__section-title">Links</h2>
            <nav className="footer__nav">
              <Link to="/" className="footer__link">Home</Link>
              <Link to="/about" className="footer__link">About us</Link>
              <Link to="/#services" className="footer__link">Services</Link>
              <a href="#contact" className="footer__link">Contact</a>
            </nav>
          </div>

          <div className="footer__contact-block">
            <div className="footer__contact-head">
              <h2 className="footer__section-title">Contact</h2>
              <button
                type="button"
                className="footer__to-top"
                onClick={scrollToTop}
                aria-label="Scroll to top"
              >
                <FiChevronUp />
              </button>
            </div>
            <div className="footer__contact-rows">
              <div className="footer__contact-row">
                <FaMapMarkerAlt className="footer__contact-icon" aria-hidden />
                <span>{SITE_CONTACT.addressShort}</span>
              </div>
              <div className="footer__contact-row">
                <FaPhoneAlt className="footer__contact-icon" aria-hidden />
                <span>{SITE_CONTACT.phoneDisplay}</span>
              </div>
              <div className="footer__contact-row">
                <FaEnvelope className="footer__contact-icon" aria-hidden />
                <a href={`mailto:${SITE_CONTACT.email}`} className="footer__contact-link">
                  {SITE_CONTACT.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} GGRC Armenia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
