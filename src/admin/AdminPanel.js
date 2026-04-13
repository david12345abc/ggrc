import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminLogin from './AdminLogin';
import AdminLayout from './AdminLayout';
import AdminPageEditor from './AdminPageEditor';
import UserManagement from './UserManagement';
import './css/admin-layout.css';
import './css/admin-common.css';
import './css/admin-page-editor.css';
import './css/admin-users.css';
import './css/admin-ve-toolbar.css';
import './css/admin-ve-cards.css';
import './css/admin-ve-type-select.css';

const AdminPanel = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="admin-loading">Loading...</div>;

  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/admin-panel/login" replace />} />
      </Routes>
    );
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-panel/page/home" replace />} />
        <Route path="page/:slug" element={<AdminPageEditor />} />
        {user.role === 'superadmin' && (
          <Route path="users" element={<UserManagement />} />
        )}
        <Route path="*" element={<Navigate to="/admin-panel/page/home" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminPanel;
