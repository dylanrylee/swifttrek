import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Sample admin data
  const admin = {
    name: "Admin",
    email: "admin@travelplanner.com"
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const handleLogout = () => {
    // Add logout logic here (for example, call auth.signOut())
    navigate('/admin-login');
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Profile Section */}
      <div className={styles.adminTopBar}>
        <div className={styles.profileWrapper}>
          <button 
            onClick={toggleDropdown}
            className={styles.profileButton}
            aria-label="Admin profile"
          >
            {admin.name.charAt(0)}
          </button>
          <div className={`${styles.profileDropdown} ${showDropdown ? styles.show : ''}`}>
            <div className={styles.dropdownHeader}>
              <div className={styles.profileInitial}>{admin.name.charAt(0)}</div>
              <div>
                <div className={styles.profileName}>{admin.name}</div>
                <div className={styles.profileEmail}>{admin.email}</div>
              </div>
            </div>
            <div className={styles.dropdownDivider} />
            <div className={styles.dropdownItem}>Settings</div>
            <div className={styles.dropdownItem}>Help Center</div>
            <div className={styles.dropdownDivider} />
            <div 
              className={styles.dropdownItem} 
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <h1 className={styles.dashboardHeader}>Admin Dashboard</h1>
      <div className={styles.actionsGrid}>
        <button 
          onClick={() => navigate('/admin/business')}
          className={styles.actionButton}
        >
          Business Listings
        </button>
        <button 
          onClick={() => navigate('/admin/customer')}
          className={styles.actionButton}
        >
          Customer Listings
        </button>
        {/* The User Management button navigates to '/admin/users' */}
        <button 
          onClick={() => navigate('/admin/users')}
          className={styles.actionButton}
        >
          User Management
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
