import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <div className="footer__logo">
              <img
                src="/images/logo.png"
                alt="GGRC Armenia"
                className="footer__logo-img"
              />
            </div>
            <p className="footer__desc">
              Your trusted partner on the journey to parenthood. Georgian-German
              Reproductive Center, Armenia Branch.
            </p>
          </div>

          <div className="footer__links">
            <h4 className="footer__heading">Quick Links</h4>
            <a href="#home" className="footer__link">Home</a>
            <a href="#about" className="footer__link">About Us</a>
            <a href="#services" className="footer__link">Services</a>
            <a href="#team" className="footer__link">Our Team</a>
            <a href="#blog" className="footer__link">Blog</a>
          </div>

          <div className="footer__contact">
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-item">
              <FaPhoneAlt />
              <span>+374 XX XXX XXX</span>
            </div>
            <div className="footer__contact-item">
              <FaEnvelope />
              <span>info@ggrc.am</span>
            </div>
            <div className="footer__contact-item">
              <FaMapMarkerAlt />
              <span>Yerevan, Armenia</span>
            </div>
          </div>

          <div className="footer__social-section">
            <h4 className="footer__heading">Follow Us</h4>
            <div className="footer__socials">
              <a href="https://facebook.com" className="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" className="footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com" className="footer__social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <FaYoutube />
              </a>
              <a href="https://tiktok.com" className="footer__social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <FaTiktok />
              </a>
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
