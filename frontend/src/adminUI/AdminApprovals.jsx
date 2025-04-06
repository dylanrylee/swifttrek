import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Fixed import
import styles from './AdminServices.module.css';

const AdminApprovals = () => {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState('cars');
    const [approvals, setApprovals] = useState({
        cars: [
            { id: 1, model: 'Toyota Camry', owner: 'Hertz', status: 'pending' },
            { id: 2, model: 'BMW X5', owner: 'Avis', status: 'pending' }
        ],
        flights: [
            { id: 1, airline: 'Delta', route: 'NYC-LON', status: 'pending' }
        ],
        accommodations: [
            { id: 1, name: 'Grand Hotel', location: 'Paris', status: 'pending' }
        ]
    });
  const handleApprove = (type, id) => {
    setApprovals(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }));
  };

  const handleReject = (type, id) => {
    setApprovals(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, status: 'rejected' } : item
      )
    }));
  };

  return (
    <div className={styles.serviceContainer}>
      <div className={styles.header}>
        <h1>Manage Approvals</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin-dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'cars' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('cars')}
        >
          Car Rentals
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'flights' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('flights')}
        >
          Flight Bookings
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'accommodations' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('accommodations')}
        >
          Accommodations
        </button>
      </div>

      <div className={styles.listContainer}>
        {activeTab === 'cars' && (
          <ApprovalList
            items={approvals.cars}
            columns={['Model', 'Owner']}
            onApprove={(id) => handleApprove('cars', id)}
            onReject={(id) => handleReject('cars', id)}
          />
        )}
        
        {activeTab === 'flights' && (
          <ApprovalList
            items={approvals.flights}
            columns={['Airline', 'Route']}
            onApprove={(id) => handleApprove('flights', id)}
            onReject={(id) => handleReject('flights', id)}
          />
        )}
        
        {activeTab === 'accommodations' && (
          <ApprovalList
            items={approvals.accommodations}
            columns={['Name', 'Location']}
            onApprove={(id) => handleApprove('accommodations', id)}
            onReject={(id) => handleReject('accommodations', id)}
          />
        )}
      </div>
    </div>
  );
};

const ApprovalList = ({ items, columns, onApprove, onReject }) => {
  if (items.length === 0) {
    return <p className={styles.noResults}>No pending approvals</p>;
  }

  return (
    <table className={styles.listTable}>
      <thead>
        <tr>
          {columns.map(col => <th key={col}>{col}</th>)}
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map(item => (
          <tr key={item.id}>
            {columns.map(col => (
              <td key={`${item.id}-${col}`}>{item[col.toLowerCase()]}</td>
            ))}
            <td>
              <span className={`${styles.status} ${styles.pending}`}>
                Pending
              </span>
            </td>
            <td>
              <button 
                className={styles.approveButton}
                onClick={() => onApprove(item.id)}
              >
                Approve
              </button>
              <button 
                className={styles.rejectButton}
                onClick={() => onReject(item.id)}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminApprovals;