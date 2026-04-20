import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import useSiteSettings from '../hooks/useSiteSettings';
import useLanguage from '../hooks/useLanguage';
import { publicApi } from '../api';
import './ContactPage.css';

const TEXT = {
  en: {
    breadcrumbHome: 'HOME',
    breadcrumbCurrent: 'CONTACT',
    infoContactTitle: 'Contact',
    infoEmailTitle: 'Email Address',
    infoAddressTitle: 'Address',
    sendTitle: 'SEND A MESSAGE',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email Address',
    phone: 'Phone',
    subject: 'Subject',
    message: 'Message',
    sendBtn: 'Send Message',
    sending: 'Sending…',
    successTitle: 'Message sent!',
    successDesc: 'Thank you for reaching out. Our team will reply shortly.',
    errorTitle: 'Could not send the message',
    errorDesc: 'Please try again in a moment, or write to us directly.',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    tooShort: 'Please write at least a few words',
  },
  ru: {
    breadcrumbHome: 'ГЛАВНАЯ',
    breadcrumbCurrent: 'КОНТАКТЫ',
    infoContactTitle: 'Контакты',
    infoEmailTitle: 'Электронная почта',
    infoAddressTitle: 'Адрес',
    sendTitle: 'ОТПРАВИТЬ СООБЩЕНИЕ',
    firstName: 'Имя',
    lastName: 'Фамилия',
    email: 'Электронная почта',
    phone: 'Телефон',
    subject: 'Тема',
    message: 'Сообщение',
    sendBtn: 'Отправить',
    sending: 'Отправка…',
    successTitle: 'Сообщение отправлено!',
    successDesc: 'Спасибо за обращение. Наша команда свяжется с вами в ближайшее время.',
    errorTitle: 'Не удалось отправить сообщение',
    errorDesc: 'Попробуйте ещё раз или напишите нам напрямую.',
    required: 'Это поле обязательно',
    invalidEmail: 'Укажите корректный email',
    tooShort: 'Напишите хотя бы пару слов',
  },
  am: {
    breadcrumbHome: '\u0533\u056c\u056d\u0561\u057e\u0578\u0580',
    breadcrumbCurrent: '\u053f\u0531\u054a',
    infoContactTitle: '\u053f\u0561\u057a',
    infoEmailTitle: '\u0537\u056c\u2024 \u0583\u0578\u057d\u057f',
    infoAddressTitle: '\u0540\u0561\u057d\u0581\u0565',
    sendTitle: '\u0548\u0552\u0542\u0531\u0580\u053f\u0535\u0551 \u0540\u0531\u0542\u0548\u0550\u0534\u0531\u0533\u0550\u0548\u0552\u0539\u0545\u0548\u0552\u0546',
    firstName: '\u0531\u0576\u0578\u0582\u0576',
    lastName: '\u0531\u0566\u0563\u0561\u0576\u0578\u0582\u0576',
    email: '\u0537\u056c\u2024 \u0583\u0578\u057d\u057f',
    phone: '\u0540\u0565\u057c\u0561\u056d\u0578\u057d',
    subject: '\u0539\u0565\u0574\u0561',
    message: '\u0540\u0561\u0572\u0578\u0580\u0564\u0561\u0563\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576',
    sendBtn: '\u0548\u0582\u0572\u0561\u0580\u056f\u0565\u056c',
    sending: '\u0548\u0582\u0572\u0561\u0580\u056f\u0574\u0561\u0576 \u0567\u2026',
    successTitle: '\u0540\u0561\u0572\u0578\u0580\u0564\u0561\u0563\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0578\u0582\u0572\u0561\u0580\u056f\u057e\u0565\u056c \u0567:',
    successDesc: '\u0547\u0576\u0578\u0580\u0570\u0561\u056f\u0561\u056c \u0565\u0576\u0584 \u0564\u056b\u0574\u0565\u056c\u0578\u0582 \u0570\u0561\u0574\u0561\u0580: \u0544\u0565\u0576\u0584 \u056f\u056f\u0561\u057a\u057e\u0565\u0576\u0584 \u0571\u0565\u0566 \u0570\u0565\u057f \u0577\u0578\u0582\u057f\u0578\u057e:',
    errorTitle: '\u0540\u0561\u0572\u0578\u0580\u0564\u0561\u0563\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0579\u057d\u057f\u0561\u0581\u057e\u0565\u0581:',
    errorDesc: '\u0553\u0578\u0580\u0571\u0565\u0584 \u056f\u0580\u056f\u056b\u0576 \u056f\u0561\u0574 \u0563\u0580\u0565\u0584 \u0574\u0565\u0566 \u0578\u0582\u0572\u0572\u0561\u056f\u056b:',
    required: '\u053f\u0561\u0580\u0578\u0572 \u0534\u0561\u0577\u057f\u0568 \u057a\u0561\u0580\u057f\u0561\u0564\u056b\u0580 \u0567',
    invalidEmail: '\u053f\u0561\u0580\u0578\u0572 \u0533\u0580\u0565\u0584 \u0568\u0576\u0564\u0578\u0582\u0576\u0565\u056c\u056b email',
    tooShort: '\u0533\u0580\u0565\u0584 \u0563\u0578\u0576\u0565 \u0574\u056b \u0584\u0561\u0576\u056b \u0562\u0561\u057c',
  },
};

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
  const settings = useSiteSettings();
  const { language } = useLanguage();
  const t = TEXT[language] || TEXT.en;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const phones = useMemo(() => {
    if (Array.isArray(settings?.phones) && settings.phones.length) return settings.phones;
    return ['(+374) 95520055', '(+374) 60530055'];
  }, [settings]);
  const email = settings?.email || 'ggrcarmenia@gmail.com';
  const address = settings?.address || 'Armenia, Yerevan Abovyan 56/4';

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!values.first_name.trim()) errs.first_name = t.required;
    if (!values.email.trim()) errs.email = t.required;
    else if (!EMAIL_RE.test(values.email.trim())) errs.email = t.invalidEmail;
    if (!values.message.trim()) errs.message = t.required;
    else if (values.message.trim().length < 5) errs.message = t.tooShort;
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus('sending');
    try {
      await publicApi.sendContactMessage({
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setStatus('success');
      setValues(initialValues);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <main className="contact-page">
      <section
        className="contact-hero"
        style={{ backgroundImage: 'url(/images/neural-network.jpg)' }}
      >
        <div className="contact-hero__overlay" />
        <div className="container contact-hero__inner">
          <nav className="contact-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="contact-hero__breadcrumb-link">{t.breadcrumbHome}</Link>
            <span className="contact-hero__breadcrumb-sep" aria-hidden> &gt; </span>
            <span className="contact-hero__breadcrumb-current">{t.breadcrumbCurrent}</span>
          </nav>
        </div>
      </section>

      <section className="contact-info">
        <div className="container contact-info__grid">
          <article className="contact-card">
            <div className="contact-card__icon" aria-hidden="true">
              <FiPhone />
            </div>
            <div className="contact-card__body">
              <h3 className="contact-card__title">{t.infoContactTitle}</h3>
              <ul className="contact-card__list">
                {phones.map((phone) => {
                  const tel = phone.replace(/[^\d+]/g, '');
                  return (
                    <li key={phone}>
                      <a href={`tel:${tel}`}>{phone}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </article>

          <article className="contact-card">
            <div className="contact-card__icon" aria-hidden="true">
              <FiMail />
            </div>
            <div className="contact-card__body">
              <h3 className="contact-card__title">{t.infoEmailTitle}</h3>
              <ul className="contact-card__list">
                <li>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              </ul>
            </div>
          </article>

          <article className="contact-card">
            <div className="contact-card__icon" aria-hidden="true">
              <FiMapPin />
            </div>
            <div className="contact-card__body">
              <h3 className="contact-card__title">{t.infoAddressTitle}</h3>
              <ul className="contact-card__list">
                <li>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {address}
                  </a>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <h2 className="contact-form-section__title">{t.sendTitle}</h2>

          {status === 'success' && (
            <div className="contact-alert contact-alert--success" role="status">
              <FiCheckCircle className="contact-alert__icon" aria-hidden="true" />
              <div>
                <strong>{t.successTitle}</strong>
                <p>{t.successDesc}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="contact-alert contact-alert--error" role="alert">
              <FiAlertCircle className="contact-alert__icon" aria-hidden="true" />
              <div>
                <strong>{t.errorTitle}</strong>
                <p>{t.errorDesc}</p>
              </div>
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row contact-form__row--2">
              <div className={`contact-field ${errors.first_name ? 'contact-field--error' : ''}`}>
                <input
                  id="cf-first-name"
                  className="contact-field__input"
                  type="text"
                  value={values.first_name}
                  onChange={update('first_name')}
                  autoComplete="given-name"
                  placeholder=" "
                />
                <label className="contact-field__label" htmlFor="cf-first-name">{t.firstName}</label>
                {errors.first_name && <span className="contact-field__error">{errors.first_name}</span>}
              </div>

              <div className="contact-field">
                <input
                  id="cf-last-name"
                  className="contact-field__input"
                  type="text"
                  value={values.last_name}
                  onChange={update('last_name')}
                  autoComplete="family-name"
                  placeholder=" "
                />
                <label className="contact-field__label" htmlFor="cf-last-name">{t.lastName}</label>
              </div>
            </div>

            <div className="contact-form__row contact-form__row--2">
              <div className={`contact-field ${errors.email ? 'contact-field--error' : ''}`}>
                <input
                  id="cf-email"
                  className="contact-field__input"
                  type="email"
                  value={values.email}
                  onChange={update('email')}
                  autoComplete="email"
                  placeholder=" "
                />
                <label className="contact-field__label" htmlFor="cf-email">{t.email}</label>
                {errors.email && <span className="contact-field__error">{errors.email}</span>}
              </div>

              <div className="contact-field">
                <input
                  id="cf-phone"
                  className="contact-field__input"
                  type="tel"
                  value={values.phone}
                  onChange={update('phone')}
                  autoComplete="tel"
                  placeholder=" "
                />
                <label className="contact-field__label" htmlFor="cf-phone">{t.phone}</label>
              </div>
            </div>

            <div className="contact-field">
              <input
                id="cf-subject"
                className="contact-field__input"
                type="text"
                value={values.subject}
                onChange={update('subject')}
                placeholder=" "
              />
              <label className="contact-field__label" htmlFor="cf-subject">{t.subject}</label>
            </div>

            <div className={`contact-field ${errors.message ? 'contact-field--error' : ''}`}>
              <textarea
                id="cf-message"
                className="contact-field__textarea"
                value={values.message}
                onChange={update('message')}
                rows={6}
                placeholder=" "
              />
              <label className="contact-field__label" htmlFor="cf-message">{t.message}</label>
              {errors.message && <span className="contact-field__error">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="contact-form__submit"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? t.sending : t.sendBtn}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
