import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUsers } from 'react-icons/fi';
import { publicApi } from '../api';
import useAuth from '../hooks/useAuth';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    publicApi.getPages().then(({ data }) => setPages(data)).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
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
          {pages.map((p) => (
            <NavLink
              key={p.slug}
              to={`/admin-panel/page/${p.slug}`}
              className={({ isActive }) => `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {p.title}
            </NavLink>
          ))}
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
    </div>
  );
};

export default AdminLayout;
