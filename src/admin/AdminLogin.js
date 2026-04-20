import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useAdminT from './i18n';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const t = useAdminT();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin-panel');
    } catch (err) {
      setError(err.response?.data?.detail || t.login.loginFailed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <div className="admin-login__logo">{t.login.title}</div>
        {error && <div className="admin-login__error">{error}</div>}
        <input
          className="admin-input"
          type="text"
          placeholder={t.login.username}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="admin-input"
          type="password"
          placeholder={t.login.password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="admin-btn admin-btn--primary" type="submit" disabled={submitting}>
          {submitting ? t.login.signingIn : t.login.signIn}
        </button>
        <Link to="/" className="admin-login__home-link">
          {t.login.backToSite}
        </Link>
      </form>
    </div>
  );
};

export default AdminLogin;
