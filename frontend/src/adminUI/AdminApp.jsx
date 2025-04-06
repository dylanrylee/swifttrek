import React from 'react';
import AdminDashboard from './components/AdminDashboard';
import AdminNavbar from './components/AdminNavbar';
import './admin.css'; // create this for admin-specific styles

const AdminApp = () => {
  return (
    <div className="admin-app">
      <AdminNavbar />
      <div className="admin-content">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminApp;