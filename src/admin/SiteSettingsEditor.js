import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FiPlus, FiTrash2, FiSave, FiCheckCircle, FiAlertCircle,
  FiImage, FiX, FiSend, FiMail, FiEye, FiEyeOff,
} from 'react-icons/fi';
import { adminApi } from '../api';
import useAdminT from './i18n';

const EMPTY_STATE = {
  address: '',
  address_short: '',
  phones: [],
  phone_display: '',
  email: '',
  instagram_url: '',
  linkedin_url: '',
  facebook_url: '',
  youtube_video_id: '',
};

const EMAIL_EMPTY = {
  backend: 'smtp',
  host: 'smtp.gmail.com',
  port: 587,
  use_tls: true,
  use_ssl: false,
  username: '',
  password: '',
  password_set: false,
  timeout: 15,
  from_email: '',
  contact_inbox: '',
};

const SiteSettingsEditor = () => {
  const [state, setState] = useState(EMPTY_STATE);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPurpleUrl, setLogoPurpleUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPurpleFile, setLogoPurpleFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoPurplePreview, setLogoPurplePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  const [email, setEmail] = useState(EMAIL_EMPTY);
  const [emailPasswordTouched, setEmailPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [testTo, setTestTo] = useState('');
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const t = useAdminT();

  const logoInputRef = useRef(null);
  const logoPurpleInputRef = useRef(null);

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      adminApi.getSiteSettings(),
      adminApi.getEmailSettings().catch(() => ({ data: null })),
    ])
      .then(([{ data }, { data: emailData }]) => {
        setState({
          address: data.address || '',
          address_short: data.address_short || '',
          phones: Array.isArray(data.phones) ? data.phones : [],
          phone_display: data.phone_display || '',
          email: data.email || '',
          instagram_url: data.instagram_url || '',
          linkedin_url: data.linkedin_url || '',
          facebook_url: data.facebook_url || '',
          youtube_video_id: data.youtube_video_id || '',
        });
        setLogoUrl(data.logo_url || '');
        setLogoPurpleUrl(data.logo_purple_url || '');

        if (emailData) {
          setEmail({
            backend: emailData.backend || 'smtp',
            host: emailData.host || '',
            port: emailData.port ?? 587,
            use_tls: !!emailData.use_tls,
            use_ssl: !!emailData.use_ssl,
            username: emailData.username || '',
            password: '',
            password_set: !!emailData.password_set,
            timeout: emailData.timeout ?? 15,
            from_email: emailData.from_email || '',
            contact_inbox: emailData.contact_inbox || '',
          });
          setEmailPasswordTouched(false);
          setTestTo(emailData.contact_inbox || emailData.username || '');
        }
      })
      .catch(() => setStatus({ type: 'error', text: t.site.loadFailed }))
      .finally(() => setLoading(false));
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const update = (field) => (e) => {
    setState((prev) => ({ ...prev, [field]: e.target.value }));
    setStatus(null);
  };

  const handleAddPhone = () => {
    setState((prev) => ({ ...prev, phones: [...prev.phones, ''] }));
    setStatus(null);
  };

  const handlePhoneChange = (index, value) => {
    setState((prev) => {
      const next = [...prev.phones];
      next[index] = value;
      return { ...prev, phones: next };
    });
    setStatus(null);
  };

  const handleRemovePhone = (index) => {
    setState((prev) => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index),
    }));
    setStatus(null);
  };

  const handleMovePhone = (index, direction) => {
    setState((prev) => {
      const next = [...prev.phones];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, phones: next };
    });
  };

  const pickLogo = (kind, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (kind === 'logo') {
      setLogoFile(file);
      setLogoPreview(preview);
    } else {
      setLogoPurpleFile(file);
      setLogoPurplePreview(preview);
    }
    setStatus(null);
  };

  const clearLogo = (kind) => {
    if (kind === 'logo') {
      setLogoFile(null);
      setLogoPreview('');
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      setLogoPurpleFile(null);
      setLogoPurplePreview('');
      if (logoPurpleInputRef.current) logoPurpleInputRef.current.value = '';
    }
  };

  const updateEmail = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEmail((prev) => ({ ...prev, [field]: value }));
    if (field === 'password') setEmailPasswordTouched(true);
    setEmailStatus(null);
  };

  const handleSaveEmail = async () => {
    setSavingEmail(true);
    setEmailStatus(null);
    try {
      const payload = {
        backend: email.backend,
        host: email.host.trim(),
        port: Number(email.port) || 587,
        use_tls: !!email.use_tls,
        use_ssl: !!email.use_ssl,
        username: email.username.trim(),
        timeout: Number(email.timeout) || 15,
        from_email: email.from_email.trim(),
        contact_inbox: email.contact_inbox.trim(),
      };
      if (emailPasswordTouched) {
        payload.password = email.password;
      }
      const { data } = await adminApi.updateEmailSettings(payload);
      setEmail((prev) => ({
        ...prev,
        ...data,
        password: '',
        password_set: !!data.password_set,
      }));
      setEmailPasswordTouched(false);
      setEmailStatus({ type: 'success', text: t.site.emailSaved });
    } catch (err) {
      const detail = err.response?.data;
      const msg = typeof detail === 'object' && detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
        : detail?.detail || err.message;
      setEmailStatus({ type: 'error', text: msg });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSendTest = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const { data } = await adminApi.sendTestEmail(testTo.trim() || null);
      setTestStatus({
        type: 'success',
        text: t.site.testOk(data.to, data.backend),
      });
    } catch (err) {
      const detail = err.response?.data;
      const msg = detail?.detail || err.message;
      setTestStatus({ type: 'error', text: t.site.testFail(msg) });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload = {
        ...state,
        phones: state.phones.map((p) => (p || '').trim()).filter(Boolean),
      };
      if (logoFile) payload.logo = logoFile;
      if (logoPurpleFile) payload.logo_purple = logoPurpleFile;

      const { data } = await adminApi.updateSiteSettings(payload);

      setState((prev) => ({
        ...prev,
        phones: Array.isArray(data.phones) ? data.phones : prev.phones,
      }));
      if (data.logo_url) setLogoUrl(data.logo_url);
      if (data.logo_purple_url) setLogoPurpleUrl(data.logo_purple_url);
      clearLogo('logo');
      clearLogo('logo_purple');
      setStatus({ type: 'success', text: t.site.savedOk });
    } catch (err) {
      const detail = err.response?.data;
      const msg = typeof detail === 'object' && detail
        ? Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
        : detail?.detail || err.message;
      setStatus({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="admin-loading">{t.site.loading}</div>;
  }

  return (
    <div className="site-settings-editor">
      <div className="site-settings-editor__header">
        <div>
          <h1 className="site-settings-editor__title">{t.site.title}</h1>
          <p className="site-settings-editor__subtitle">
            {t.site.subtitle}
          </p>
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={saving}
        >
          <FiSave /> {saving ? t.site.savingDots : t.site.saveChanges}
        </button>
      </div>

      {status && (
        <div className={`sse-alert sse-alert--${status.type}`}>
          {status.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          <span>{status.text}</span>
        </div>
      )}

      <div className="sse-grid">
        {/* Contact block */}
        <section className="sse-card">
          <h2 className="sse-card__title">{t.site.contactBlock}</h2>

          <div className="sse-field">
            <label className="sse-label">{t.site.emailLabel}</label>
            <input
              type="email"
              className="sse-input"
              value={state.email}
              onChange={update('email')}
              placeholder={t.site.emailPlaceholder}
            />
            <small className="sse-hint">{t.site.emailHint}</small>
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.phonesLabel}</label>
            <div className="sse-phones">
              {state.phones.length === 0 && (
                <p className="sse-phones__empty">{t.site.phonesEmpty}</p>
              )}
              {state.phones.map((phone, index) => (
                <div key={index} className="sse-phones__row">
                  <input
                    type="text"
                    className="sse-input"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    placeholder={t.site.phonePlaceholder}
                  />
                  <div className="sse-phones__actions">
                    <button
                      type="button"
                      className="sse-icon-btn"
                      onClick={() => handleMovePhone(index, -1)}
                      disabled={index === 0}
                      title={t.site.phoneMoveUp}
                    >↑</button>
                    <button
                      type="button"
                      className="sse-icon-btn"
                      onClick={() => handleMovePhone(index, 1)}
                      disabled={index === state.phones.length - 1}
                      title={t.site.phoneMoveDown}
                    >↓</button>
                    <button
                      type="button"
                      className="sse-icon-btn sse-icon-btn--danger"
                      onClick={() => handleRemovePhone(index)}
                      title={t.site.phoneRemove}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="admin-btn admin-btn--ghost sse-add-btn" onClick={handleAddPhone}>
              <FiPlus /> {t.site.addPhone}
            </button>
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.phoneDisplayLabel}</label>
            <input
              type="text"
              className="sse-input"
              value={state.phone_display}
              onChange={update('phone_display')}
              placeholder={t.site.phoneDisplayPlaceholder}
            />
            <small className="sse-hint">{t.site.phoneDisplayHint}</small>
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.addressFullLabel}</label>
            <input
              type="text"
              className="sse-input"
              value={state.address}
              onChange={update('address')}
              placeholder={t.site.addressFullPlaceholder}
            />
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.addressShortLabel}</label>
            <input
              type="text"
              className="sse-input"
              value={state.address_short}
              onChange={update('address_short')}
              placeholder={t.site.addressShortPlaceholder}
            />
            <small className="sse-hint">{t.site.addressShortHint}</small>
          </div>
        </section>

        {/* Socials block */}
        <section className="sse-card">
          <h2 className="sse-card__title">{t.site.socialBlock}</h2>

          <div className="sse-field">
            <label className="sse-label">{t.site.instagramLabel}</label>
            <input
              type="url"
              className="sse-input"
              value={state.instagram_url}
              onChange={update('instagram_url')}
              placeholder="https://instagram.com/ggrcarmenia"
            />
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.linkedinLabel}</label>
            <input
              type="url"
              className="sse-input"
              value={state.linkedin_url}
              onChange={update('linkedin_url')}
              placeholder="https://linkedin.com/company/ggrc"
            />
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.facebookLabel}</label>
            <input
              type="url"
              className="sse-input"
              value={state.facebook_url}
              onChange={update('facebook_url')}
              placeholder="https://facebook.com/ggrcarmenia"
            />
          </div>

          <div className="sse-field">
            <label className="sse-label">{t.site.youtubeIdLabel}</label>
            <input
              type="text"
              className="sse-input"
              value={state.youtube_video_id}
              onChange={update('youtube_video_id')}
              placeholder="dQw4w9WgXcQ"
            />
            <small className="sse-hint">{t.site.youtubeIdHint}</small>
          </div>
        </section>

        {/* Email / SMTP block */}
        <section className="sse-card sse-card--wide">
          <div className="sse-card__head">
            <div>
              <h2 className="sse-card__title sse-card__title--plain">
                <FiMail style={{ marginRight: 8, verticalAlign: '-2px' }} />
                {t.site.smtpBlock}
              </h2>
              <p className="sse-card__hint">
                {t.site.smtpHint1}{' '}
                {t.site.smtpHint2Before}
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">{t.site.smtpHint2Link}</a>
                {t.site.smtpHint2After}
              </p>
            </div>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              onClick={handleSaveEmail}
              disabled={savingEmail}
            >
              <FiSave /> {savingEmail ? t.site.savingEmail : t.site.saveEmail}
            </button>
          </div>

          {emailStatus && (
            <div className={`sse-alert sse-alert--${emailStatus.type}`}>
              {emailStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
              <span>{emailStatus.text}</span>
            </div>
          )}

          <div className="sse-email-grid">
            <div className="sse-field">
              <label className="sse-label">{t.site.backendLabel}</label>
              <select
                className="sse-input"
                value={email.backend}
                onChange={updateEmail('backend')}
              >
                <option value="smtp">{t.site.backendSmtp}</option>
                <option value="console">{t.site.backendConsole}</option>
              </select>
              <small className="sse-hint">{t.site.backendHint}</small>
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.hostLabel}</label>
              <input
                type="text"
                className="sse-input"
                value={email.host}
                onChange={updateEmail('host')}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.portLabel}</label>
              <input
                type="number"
                className="sse-input"
                value={email.port}
                onChange={updateEmail('port')}
                placeholder="587"
              />
            </div>

            <div className="sse-field sse-field--toggles">
              <label className="sse-checkbox">
                <input
                  type="checkbox"
                  checked={email.use_tls}
                  onChange={updateEmail('use_tls')}
                />
                <span>{t.site.useTls}</span>
              </label>
              <label className="sse-checkbox">
                <input
                  type="checkbox"
                  checked={email.use_ssl}
                  onChange={updateEmail('use_ssl')}
                />
                <span>{t.site.useSsl}</span>
              </label>
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.smtpUsernameLabel}</label>
              <input
                type="email"
                className="sse-input"
                value={email.username}
                onChange={updateEmail('username')}
                placeholder={t.site.smtpUsernamePlaceholder}
                autoComplete="username"
              />
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.smtpPasswordLabel}</label>
              <div className="sse-password-row">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="sse-input"
                  value={email.password}
                  onChange={updateEmail('password')}
                  placeholder={email.password_set ? t.site.smtpPasswordSaved : t.site.smtpPasswordPlaceholder}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="sse-icon-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  title={showPassword ? t.site.hidePassword : t.site.showPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <small className="sse-hint">
                {email.password_set
                  ? t.site.passwordStoredHint
                  : t.site.passwordMissingHint}
              </small>
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.fromLabel}</label>
              <input
                type="email"
                className="sse-input"
                value={email.from_email}
                onChange={updateEmail('from_email')}
                placeholder={t.site.fromPlaceholder}
              />
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.inboxLabel}</label>
              <input
                type="email"
                className="sse-input"
                value={email.contact_inbox}
                onChange={updateEmail('contact_inbox')}
                placeholder={t.site.inboxPlaceholder}
              />
              <small className="sse-hint">{t.site.inboxHint}</small>
            </div>

            <div className="sse-field">
              <label className="sse-label">{t.site.timeoutLabel}</label>
              <input
                type="number"
                className="sse-input"
                value={email.timeout}
                onChange={updateEmail('timeout')}
                placeholder="15"
              />
            </div>
          </div>

          <div className="sse-test-box">
            <h3 className="sse-test-box__title">{t.site.testBoxTitle}</h3>
            <p className="sse-test-box__hint">
              {t.site.testBoxHint}
            </p>
            <div className="sse-test-box__row">
              <input
                type="email"
                className="sse-input"
                value={testTo}
                onChange={(e) => { setTestTo(e.target.value); setTestStatus(null); }}
                placeholder={t.site.testPlaceholder}
              />
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                onClick={handleSendTest}
                disabled={testing}
              >
                <FiSend /> {testing ? t.site.sendingTest : t.site.sendTest}
              </button>
            </div>
            {testStatus && (
              <div className={`sse-alert sse-alert--${testStatus.type} sse-alert--compact`}>
                {testStatus.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                <span>{testStatus.text}</span>
              </div>
            )}
          </div>
        </section>

        {/* Logos block */}
        <section className="sse-card sse-card--wide">
          <h2 className="sse-card__title">{t.site.logosBlock}</h2>

          <div className="sse-logo-row">
            <LogoPicker
              label={t.site.logoDark}
              currentUrl={logoPreview || logoUrl}
              inputRef={logoInputRef}
              onPick={(file) => pickLogo('logo', file)}
              onClear={logoPreview ? () => clearLogo('logo') : null}
              isNew={!!logoPreview}
              t={t}
            />

            <LogoPicker
              label={t.site.logoLight}
              currentUrl={logoPurplePreview || logoPurpleUrl}
              inputRef={logoPurpleInputRef}
              onPick={(file) => pickLogo('logo_purple', file)}
              onClear={logoPurplePreview ? () => clearLogo('logo_purple') : null}
              isNew={!!logoPurplePreview}
              t={t}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const LogoPicker = ({ label, currentUrl, inputRef, onPick, onClear, isNew, t }) => (
  <div className="sse-logo-picker">
    <div className="sse-logo-picker__label">{label}</div>
    <div className="sse-logo-picker__preview">
      {currentUrl ? (
        <img src={currentUrl} alt="" />
      ) : (
        <div className="sse-logo-picker__empty">
          <FiImage /> {t?.site?.noLogoYet || 'No logo yet'}
        </div>
      )}
    </div>
    <div className="sse-logo-picker__actions">
      <button
        type="button"
        className="admin-btn admin-btn--ghost"
        onClick={() => inputRef.current?.click()}
      >
        <FiImage /> {currentUrl ? (t?.common?.replace || 'Replace') : (t?.common?.upload || 'Upload')}
      </button>
      {isNew && onClear && (
        <button type="button" className="admin-btn admin-btn--ghost" onClick={onClear}>
          <FiX /> {t?.common?.cancel || 'Cancel'}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
        }}
      />
    </div>
  </div>
);

export default SiteSettingsEditor;
