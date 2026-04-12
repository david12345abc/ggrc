import React, { useState, useEffect, useCallback } from 'react';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { adminApi } from '../api';
import useAuth from '../hooks/useAuth';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin' });
  const [error, setError] = useState('');

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
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error');
    }
  };

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <h1>User Management</h1>
        <button className="admin-btn admin-btn--primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Add User
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Actions</th>
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
              <td>{u.is_active ? 'Yes' : 'No'}</td>
              <td>
                {u.id !== currentUser?.id && (
                  <button className="admin-btn--danger-icon" onClick={() => handleDelete(u.id)} title="Delete">
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
              <h2>Create User</h2>
              <button className="admin-modal__close" onClick={() => setShowForm(false)}>&times;</button>
            </div>
            <form className="admin-modal__body" onSubmit={handleCreate}>
              {error && <div className="admin-login__error">{error}</div>}
              <label className="admin-field">
                <span>Username</span>
                <input className="admin-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
              </label>
              <label className="admin-field">
                <span>Email</span>
                <input className="admin-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label className="admin-field">
                <span>Password</span>
                <input className="admin-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </label>
              <label className="admin-field">
                <span>Role</span>
                <select className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="guest">Guest</option>
                  <option value="admin">Administrator</option>
                  <option value="superadmin">Super Administrator</option>
                </select>
              </label>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
