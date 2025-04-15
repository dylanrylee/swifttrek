// CustomerFlights.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, deleteDocument } from './firebaseService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import styles from './CustomerListings.module.css';

const CustomerFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData('customerFlights');
      setFlights(data);
    } catch (error) {
      console.error('Error fetching customer flights:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleApprove = async (id) => {
    try {
      const flightRef = doc(db, 'customerFlights', id);
      await updateDoc(flightRef, { status: 'approved' });
      setFlights((prevFlights) =>
        prevFlights.map(flight => flight.id === id ? { ...flight, status: 'approved' } : flight)
      );
    } catch (error) {
      console.error('Error approving customer flight:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('customerFlights', id);
      setFlights((prevFlights) => prevFlights.filter(flight => flight.id !== id));
    } catch (error) {
      console.error('Error deleting customer flight:', error);
    }
  };

  if (loading) return <div>Loading customer flight listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Customer Flight Listings</h2>
      {flights.length === 0 ? (
        <p>No customer flight listings available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Airline</th>
              <th>Route</th>
              <th>Price</th>
              <th>Status</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map(flight => (
              <tr key={flight.id}>
                <td>{flight.airline}</td>
                <td>{flight.route}</td>
                <td>${flight.price}</td>
                <td>{flight.status || 'pending'}</td>
                <td>
                  {flight.postedAt 
                    ? new Date(
                        flight.postedAt.seconds 
                          ? flight.postedAt.seconds * 1000 
                          : flight.postedAt
                      ).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td>
                  {flight.status !== 'approved' && (
                    <button 
                      className={styles.approveButton} 
                      onClick={() => handleApprove(flight.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDelete(flight.id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerFlights;
