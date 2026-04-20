import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUsers, FiPlus, FiTrash2, FiSettings, FiChevronDown, FiChevronRight, FiHelpCircle } from 'react-icons/fi';
import { publicApi, adminApi } from '../api';
import useAuth from '../hooks/useAuth';
import useAdminT from './i18n';

const YOUR_PAGES_COLLAPSED_KEY = 'admin.sidebar.yourPagesCollapsed';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [yourPagesCollapsed, setYourPagesCollapsed] = useState(() => {
    try {
      return localStorage.getItem(YOUR_PAGES_COLLAPSED_KEY) === '1';
    } catch {
      return false;
    }
  });
  const t = useAdminT();

  const toggleYourPages = () => {
    setYourPagesCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(YOUR_PAGES_COLLAPSED_KEY, next ? '1' : '0'); } catch {}
      return next;
    });
  };

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
    if (!window.confirm(t.layout.deletePageConfirm(page.title))) return;
    try {
      await adminApi.deletePage(page.id);
      loadPages();
    } catch (err) {
      alert(t.layout.errorPrefix + (err.response?.data?.detail || err.message));
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
          <span className="admin-sidebar__brand">{t.layout.brand}</span>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <FiX />
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__section-title">{t.layout.pages}</div>
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

          <button
            type="button"
            className="admin-sidebar__section-title admin-sidebar__section-title--toggle"
            onClick={toggleYourPages}
            aria-expanded={!yourPagesCollapsed}
          >
            {yourPagesCollapsed ? <FiChevronRight /> : <FiChevronDown />}
            <span>{t.layout.yourPages}</span>
            {customPages.length > 0 && (
              <span className="admin-sidebar__section-count">{customPages.length}</span>
            )}
          </button>

          {!yourPagesCollapsed && (
            <>
              {customPages.length === 0 && (
                <span className="admin-sidebar__empty">{t.layout.noPagesYet}</span>
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
                    title={t.layout.deletePageTitle}
                  >
                    <FiTrash2 />
                  </button>
                </NavLink>
              ))}
              <button
                className="admin-sidebar__add-page"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus /> {t.layout.newPage}
              </button>
            </>
          )}

          <div className="admin-sidebar__section-title">{t.layout.settings}</div>
          <NavLink
            to="/admin-panel/site-settings"
            className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiSettings style={{ marginRight: 8 }} /> {t.layout.siteSettings}
          </NavLink>

          {user?.role === 'superadmin' && (
            <NavLink
              to="/admin-panel/users"
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <FiUsers style={{ marginRight: 8 }} /> {t.layout.users}
            </NavLink>
          )}

          <NavLink
            to="/admin-panel/guide"
            className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <FiHelpCircle style={{ marginRight: 8 }} /> {t.layout.guide}
          </NavLink>
        </nav>
        <div className="admin-sidebar__footer">
          <span className="admin-sidebar__user">{user?.username} ({user?.role})</span>
          <button className="admin-sidebar__logout" onClick={handleLogout}>
            <FiLogOut /> {t.layout.logout}
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" onClick={() => setSidebarOpen(true)}>
            <FiMenu />
          </button>
          <span className="admin-topbar__title">{t.layout.adminPanel}</span>
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
  const t = useAdminT();

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
      alert(t.layout.errorPrefix + msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2>{t.layout.createNewPage}</h2>
          <button className="admin-modal__close" onClick={onClose}><FiX /></button>
        </div>
        <div className="admin-modal__body">
          <div className="ve-section-field">
            <label className="ve-label">{t.layout.pageTitleLabel}</label>
            <input
              className="ve-input"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={t.layout.pageTitlePlaceholder}
              autoFocus
            />
          </div>
          <div className="ve-section-field">
            <label className="ve-label">{t.layout.urlSlugLabel}</label>
            <input
              className="ve-input"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder={t.layout.urlSlugPlaceholder}
            />
            <small style={{ color: '#9ca3af', fontSize: 12, marginTop: 4, display: 'block' }}>
              {t.layout.pageAvailableAt} /page/{slug || '...'}
            </small>
          </div>
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn" onClick={onClose}>{t.common.cancel}</button>
          <button
            className="admin-btn admin-btn--primary"
            disabled={saving || !title.trim() || !slug.trim()}
            onClick={handleCreate}
          >
            {saving ? t.common.creating : t.layout.createPage}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
