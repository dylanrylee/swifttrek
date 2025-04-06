import React, { useState } from 'react';
import styles from './AdminServices.module.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.password) {
      setUsers([...users, { ...newUser, id: Date.now().toString() }]);
      setNewUser({ username: '', email: '', password: '', role: 'user' });
    }
  };

  return (
    <div className={styles.serviceContainer}>
      <h1>User Management</h1>
      
      <div className={styles.formContainer}>
        <h2>Add New User</h2>
        <div className={styles.formGroup}>
          <label>Username:</label>
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Password:</label>
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Role:</label>
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({...newUser, role: e.target.value})}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button 
          className={styles.addButton}
          onClick={handleAddUser}
        >
          Create User
        </button>
      </div>

      <div className={styles.listContainer}>
        <h2>Existing Users</h2>
        <table className={styles.listTable}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className={styles.actionButton}>Edit</button>
                  <button className={styles.deleteButton}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;