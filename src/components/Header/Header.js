import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { SITE_CONTACT, SOCIAL_LINKS } from '../../siteInfo';
import './Header.css';

const MOBILE_NAV = [
  { label: 'ABOUT US', to: '/about' },
  { label: 'SERVICES', to: '/#services' },
  { label: 'TEAM', to: '/#team' },
  { label: 'BLOG', to: '/#blog' },
  { label: 'CONTACT', to: '/#contact' },
];

const DESKTOP_NAV = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Services', to: '/#services' },
  { label: 'Our Team', to: '/#team' },
  { label: 'Blog', to: '/#blog' },
  { label: 'Contact', to: '/#contact' },
];

const LANGUAGES = [
  { code: 'en', label: 'English', flagSrc: '/images/flags/usa.png' },
  { code: 'hy', label: 'Հայերեն', flagSrc: '/images/flags/armenia.png' },
  { code: 'ru', label: 'Русский', flagSrc: '/images/flags/russia.png' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const closeOnWide = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', closeOnWide);
    return () => window.removeEventListener('resize', closeOnWide);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((o) => !o);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__bar" aria-hidden={menuOpen}>
        <div className="header__inner">
          <Link to="/" className="header__logo" onClick={closeMenu}>
            <img
              src="/images/logo.png"
              alt="GGRC Armenia"
              className="header__logo-img"
            />
          </Link>

          <nav className="header__nav header__nav--desktop" aria-label="Main">
            {DESKTOP_NAV.map((link) => (
              <Link key={link.to} to={link.to} className="header__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="header__menu-btn"
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="header__fullscreen" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="header__fullscreen-top">
            <Link to="/" className="header__fullscreen-logo" onClick={closeMenu}>
              <img src="/images/logo-purple.png" alt="GGRC Armenia" />
            </Link>
            <button
              type="button"
              className="header__fullscreen-close"
              onClick={closeMenu}
              aria-label="Close menu"
            >
              <HiX />
            </button>
          </div>

          <nav className="header__fullscreen-nav" aria-label="Mobile">
            {MOBILE_NAV.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="header__fullscreen-link"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header__lang">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`header__lang-btn ${lang === l.code ? 'header__lang-btn--active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                <img
                  className="header__lang-flag"
                  src={l.flagSrc}
                  alt=""
                  decoding="async"
                />
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          <div className="header__fullscreen-contact">
            <h2 className="header__fullscreen-contact-title">Contact</h2>
            <p className="header__fullscreen-line">{SITE_CONTACT.address}</p>
            <p className="header__fullscreen-line">
              <a href={`tel:${SITE_CONTACT.phones[0].replace(/\s/g, '')}`}>
                (+374) 95520055
              </a>
            </p>
            <p className="header__fullscreen-line">
              <a href={`tel:${SITE_CONTACT.phones[1].replace(/\s/g, '')}`}>
                (+374) 60530055
              </a>
            </p>
            <p className="header__fullscreen-line">
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            </p>
          </div>

          <div className="header__fullscreen-socials">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="header__fullscreen-social"
              aria-label="Instagram"
            >
              <img src="/images/icons/instagram.png" alt="" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="header__fullscreen-social"
              aria-label="LinkedIn"
            >
              <img src="/images/icons/linkedin.png" alt="" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="header__fullscreen-social"
              aria-label="Facebook"
            >
              <img src="/images/icons/facebook.png" alt="" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
