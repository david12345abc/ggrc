import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import useSiteSettings from '../../hooks/useSiteSettings';
import useLanguage from '../../hooks/useLanguage';
import Flag from '../Flags';
import './Header.css';

const NAV_LABELS = {
  en: {
    desktop: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Services', to: '/services' },
      { label: 'Our Team', to: '/team' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
    mobile: [
      { label: 'ABOUT US', to: '/about' },
      { label: 'SERVICES', to: '/services' },
      { label: 'TEAM', to: '/team' },
      { label: 'BLOG', to: '/blog' },
      { label: 'CONTACT', to: '/contact' },
    ],
    contact: 'Contact',
  },
  ru: {
    desktop: [
      { label: '\u0413\u043b\u0430\u0432\u043d\u0430\u044f', to: '/' },
      { label: '\u041e \u043d\u0430\u0441', to: '/about' },
      { label: '\u0423\u0441\u043b\u0443\u0433\u0438', to: '/services' },
      { label: '\u041d\u0430\u0448\u0430 \u043a\u043e\u043c\u0430\u043d\u0434\u0430', to: '/team' },
      { label: '\u0411\u043b\u043e\u0433', to: '/blog' },
      { label: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b', to: '/contact' },
    ],
    mobile: [
      { label: '\u041e \u041d\u0410\u0421', to: '/about' },
      { label: '\u0423\u0421\u041b\u0423\u0413\u0418', to: '/services' },
      { label: '\u041a\u041e\u041c\u0410\u041d\u0414\u0410', to: '/team' },
      { label: '\u0411\u041b\u041e\u0413', to: '/blog' },
      { label: '\u041a\u041e\u041d\u0422\u0410\u041a\u0422\u042b', to: '/contact' },
    ],
    contact: '\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b',
  },
  am: {
    desktop: [
      { label: '\u0533\u056c\u056d\u0561\u057e\u0578\u0580', to: '/' },
      { label: '\u0544\u0565\u0580 \u0574\u0561\u057d\u056b\u0576', to: '/about' },
      { label: '\u053e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580', to: '/services' },
      { label: '\u0544\u0565\u0580 \u0569\u056b\u0574\u0568', to: '/team' },
      { label: '\u0532\u056c\u0578\u0563', to: '/blog' },
      { label: '\u053f\u0561\u057a', to: '/contact' },
    ],
    mobile: [
      { label: '\u0544\u0535\u054f \u0544\u0531\u054d\u053b\u0546', to: '/about' },
      { label: '\u053e\u0531\u054c\u0531\u0545\u0548\u0552\u0539\u0545\u0548\u0552\u0546\u0546\u0535\u054f', to: '/services' },
      { label: '\u0539\u053b\u0544\u0538', to: '/team' },
      { label: '\u0532\u053c\u0548\u0533', to: '/blog' },
      { label: '\u053f\u0531\u054a', to: '/contact' },
    ],
    contact: '\u053f\u0561\u057a',
  },
};

const LANG_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'am', label: '\u0540\u0561\u0575\u0565\u0580\u0565\u0576' },
  { code: 'ru', label: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439' },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = useSiteSettings();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const address = settings?.address || 'Armenia, Yerevan Abovyan 56/4';
  const phones = settings?.phones || ['+374 95520055', '+374 60530055'];
  const email = settings?.email || 'ggrcarmenia@gmail.com';
  const socials = {
    instagram: settings?.instagram_url || 'https://instagram.com',
    linkedin: settings?.linkedin_url || 'https://linkedin.com',
    facebook: settings?.facebook_url || 'https://facebook.com',
  };
  const logoUrl = settings?.logo_url || '/images/logo.png';
  const logoPurpleUrl = settings?.logo_purple_url || '/images/logo-purple.png';

  const nav = NAV_LABELS[language] || NAV_LABELS.en;

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__bar" aria-hidden={menuOpen}>
        <div className="header__inner">
          <Link to="/" className="header__logo" onClick={closeMenu}>
            <img src={logoUrl} alt="GGRC Armenia" className="header__logo-img" />
          </Link>

          <nav className="header__nav header__nav--desktop" aria-label="Main">
            {nav.desktop.map((link) => (
              <Link key={link.to} to={link.to} className="header__nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header__desktop-lang">
            {LANG_OPTIONS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`header__desktop-lang-btn ${language === l.code ? 'header__desktop-lang-btn--active' : ''}`}
                onClick={() => setLanguage(l.code)}
              >
                <Flag code={l.code} />
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="header__menu-btn"
            onClick={() => setMenuOpen((o) => !o)}
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
              <img src={logoPurpleUrl} alt="GGRC Armenia" />
            </Link>
            <button type="button" className="header__fullscreen-close" onClick={closeMenu} aria-label="Close menu">
              <HiX />
            </button>
          </div>

          <nav className="header__fullscreen-nav" aria-label="Mobile">
            {nav.mobile.map((link) => (
              <Link key={link.to} to={link.to} className="header__fullscreen-link" onClick={closeMenu}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header__lang">
            {LANG_OPTIONS.map((l) => (
              <button
                key={l.code}
                type="button"
                className={`header__lang-btn ${language === l.code ? 'header__lang-btn--active' : ''}`}
                onClick={() => { setLanguage(l.code); closeMenu(); }}
              >
                <Flag code={l.code} />
                <span>{l.label}</span>
              </button>
            ))}
          </div>

          <div className="header__fullscreen-contact">
            <h2 className="header__fullscreen-contact-title">{nav.contact}</h2>
            <p className="header__fullscreen-line">{address}</p>
            {phones.map((phone) => (
              <p key={phone} className="header__fullscreen-line">
                <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
              </p>
            ))}
            <p className="header__fullscreen-line">
              <a href={`mailto:${email}`}>{email}</a>
            </p>
          </div>

          <div className="header__fullscreen-socials">
            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="header__fullscreen-social" aria-label="Instagram">
              <img src="/images/icons/instagram.png" alt="" />
            </a>
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="header__fullscreen-social" aria-label="LinkedIn">
              <img src="/images/icons/linkedin.png" alt="" />
            </a>
            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="header__fullscreen-social" aria-label="Facebook">
              <img src="/images/icons/facebook.png" alt="" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
