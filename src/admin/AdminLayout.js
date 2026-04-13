import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUsers, FiPlus, FiTrash2 } from 'react-icons/fi';
import { publicApi, adminApi } from '../api';
import useAuth from '../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPages = useCallback(() => {
    publicApi.getPages().then(({ data }) => setPages(data)).catch(() => {});
  }, []);

  useEffect(() => { loadPages(); }, [loadPages]);

  const navPages = pages.filter((p) => p.show_in_nav);
  const customPages = pages.filter((p) => !p.show_in_nav);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeletePage = async (e, page) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Delete page "${page.title}"? All sections will be lost.`)) return;
    try {
      await adminApi.deletePage(page.id);
      loadPages();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handlePageCreated = (newPage) => {
    setShowCreateModal(false);
    loadPages();
    navigate(`/admin-panel/page/${newPage.slug}`);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__brand">GGRC Admin</span>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-title">Pages</div>
          {navPages.map((p) => (
            <NavLink
              key={p.slug}
              to={`/admin-panel/page/${p.slug}`}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {p.title}
            </NavLink>
          ))}

          <div className="admin-sidebar__section-title">
            Your Pages
          </div>
          {customPages.length === 0 && (
            <span className="admin-sidebar__empty">No pages yet</span>
          )}
          {customPages.map((p) => (
            <NavLink
              key={p.slug}
              to={`/admin-panel/page/${p.slug}`}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-sidebar__link-text">{p.title}</span>
              <button
                className="admin-sidebar__link-delete"
                onClick={(e) => handleDeletePage(e, p)}
                title="Delete page"
              >
                <FiTrash2 />
              </button>
            </NavLink>
          ))}
          <button
            className="admin-sidebar__add-page"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> New Page
          </button>

          {user?.role === 'superadmin' && (
            <>
              <div className="admin-sidebar__section-title">Management</div>
              <NavLink
                to="/admin-panel/users"
                className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <FiUsers style={{ marginRight: 8 }} /> Users
              </NavLink>
            </>
          )}
        </nav>
        <div className="admin-sidebar__footer">
          <span className="admin-sidebar__user">{user?.username} ({user?.role})</span>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <span className="admin-topbar__title">Admin Panel</span>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </div>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      {showCreateModal && (
        <CreatePageModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handlePageCreated}
        />
      )}
    </div>
  );
};

const CreatePageModal = ({ onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  const generateSlug = (text) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (val) => {
    setTitle(val);
    if (autoSlug) setSlug(generateSlug(val));
  };

  const handleSlugChange = (val) => {
    setAutoSlug(false);
    setSlug(val);
  };

  const handleCreate = async () => {
    if (!title.trim() || !slug.trim()) return;
    setSaving(true);
    try {
      const { data } = await adminApi.createPage({
        title: title.trim(),
        slug: slug.trim(),
        show_in_nav: false,
        order: 100,
      });
      onCreated(data);
    } catch (err) {
      const detail = err.response?.data;
      const msg = typeof detail === 'object'
        ? Object.values(detail).flat().join(', ')
        : detail?.detail || err.message;
      alert('Error: ' + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>Create New Page</h2>
          <button className="admin-modal__close" onClick={onClose}><FiX /></button>
        </div>
        <div className="admin-modal__body">
          <div className="ve-section-field">
            <label className="ve-label">Page Title</label>
            <input
              className="ve-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Pricing, FAQ, Gallery..."
              autoFocus
            />
          </div>
          <div className="ve-section-field">
            <label className="ve-label">URL Slug</label>
            <input
              className="ve-input"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="e.g. pricing"
            />
            <small style={{ color: '#9ca3af', fontSize: 12, marginTop: 4, display: 'block' }}>
              Page will be available at: /page/{slug || '...'}
            </small>
          </div>
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn" onClick={onClose}>Cancel</button>
          <button
            className="admin-btn admin-btn--primary"
            disabled={saving || !title.trim() || !slug.trim()}
            onClick={handleCreate}
          >
            {saving ? 'Creating...' : 'Create Page'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
