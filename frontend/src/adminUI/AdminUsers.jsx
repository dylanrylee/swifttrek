import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCollectionData, deleteDocument } from './firebaseService';
import styles from './AdminUsers.module.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      // Fetch all users from the 'users' collection.
      const usersData = await getCollectionData('users');
      // Filter to get only business users (adjust if necessary).
      const businessUsers = usersData.filter(user => user.role === 'business');
      setUsers(businessUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteDocument('users', id);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading users...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>User Management</h2>
      <button
        onClick={() => navigate('/admin-dashboard')}
        className={styles.backButton}
      >
        Back to Dashboard
      </button>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Display Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.displayName || 'N/A'}</td>
              <td>
                <button
                  onClick={() => handleRemove(user.id)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
