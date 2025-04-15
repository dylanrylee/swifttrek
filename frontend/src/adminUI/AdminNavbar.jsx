import React from 'react';
import { FaShieldAlt, FaList, FaFlag, FaSignOutAlt } from 'react-icons/fa';

const AdminNavbar = () => {
  return (
    <nav className="admin-navbar">
      <div className="navbar-brand">
        <FaShieldAlt className="shield-icon" />
        <h2>TravelPlanner Admin</h2>
      </div>
      <div className="nav-links">
        <button className="nav-link active">
          <FaList /> Dashboard
        </button>
        <button className="nav-link">
          <FaList /> Approvals
        </button>
        <button className="nav-link">
          <FaFlag /> Moderation
        </button>
        <button className="nav-link">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;