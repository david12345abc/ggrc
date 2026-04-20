import React, { useState, useEffect, useCallback } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { adminApi } from '../api';
import useAuth from '../hooks/useAuth';
import useAdminT from './i18n';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');
  const t = useAdminT();

  const loadUsers = useCallback(() => {
    adminApi.getUsers().then(({ data }) => setUsers(data.results || data)).catch(() => {});
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminApi.createUser(form);
      setShowForm(false);
      setForm({ username: '', email: '', password: '', role: 'admin' });
      loadUsers();
    } catch (err) {
      const data = err.response?.data;
      setError(typeof data === 'object' ? JSON.stringify(data) : String(data));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.users.deleteConfirm)) return;
    try {
      await adminApi.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.detail || t.common.error);
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1>{t.users.title}</h1>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowForm(true)}>
          <FiPlus /> {t.users.addUser}
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>{t.users.id}</th>
            <th>{t.users.username}</th>
            <th>{t.users.email}</th>
            <th>{t.users.role}</th>
            <th>{t.users.active}</th>
            <th>{t.users.actions}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>
                <span className={`admin-badge admin-badge--${u.role}`}>{u.role}</span>
              </td>
              <td>{u.is_active ? t.common.yes : t.common.no}</td>
              <td>
                {u.id !== currentUser?.id && (
                  <button className="admin-btn--danger-icon" onClick={() => handleDelete(u.id)} title={t.common.delete}>
                    <FiTrash2 />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{t.users.createUser}</h2>
              <button className="admin-modal__close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form className="admin-modal__body" onSubmit={handleCreate}>
              {error && <div className="admin-login__error">{error}</div>}
              <label className="admin-field">
                <span>{t.users.username}</span>
                <input className="admin-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </label>
              <label className="admin-field">
                <span>{t.users.email}</span>
                <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label className="admin-field">
                <span>{t.users.password}</span>
                <input className="admin-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </label>
              <label className="admin-field">
                <span>{t.users.role}</span>
                <select className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="guest">{t.users.roleGuest}</option>
                  <option value="admin">{t.users.roleAdmin}</option>
                  <option value="superadmin">{t.users.roleSuperadmin}</option>
                </select>
              </label>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn" onClick={() => setShowForm(false)}>{t.common.cancel}</button>
                <button type="submit" className="admin-btn admin-btn--primary">{t.common.create}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
