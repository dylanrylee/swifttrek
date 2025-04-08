// CustomerHotels.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, deleteDocument } from './firebaseService';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import styles from './CustomerListings.module.css';

const CustomerHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData('customerHotels');
      setHotels(data);
    } catch (error) {
      console.error('Error fetching customer hotels:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleApprove = async (id) => {
    try {
      const hotelRef = doc(db, 'customerHotels', id);
      await updateDoc(hotelRef, { status: 'approved' });
      setHotels((prevHotels) =>
        prevHotels.map(hotel => hotel.id === id ? { ...hotel, status: 'approved' } : hotel)
      );
    } catch (error) {
      console.error('Error approving customer hotel:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('customerHotels', id);
      setHotels((prevHotels) => prevHotels.filter(hotel => hotel.id !== id));
    } catch (error) {
      console.error('Error deleting customer hotel:', error);
    }
  };

  if (loading) return <div>Loading customer hotel listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Customer Hotel Listings</h2>
      {hotels.length === 0 ? (
        <p>No customer hotel listings available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hotel Name</th>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.location}</td>
                <td>${hotel.price}</td>
                <td>{hotel.status || 'pending'}</td>
                <td>
                  {hotel.postedAt 
                    ? new Date(
                        hotel.postedAt.seconds 
                          ? hotel.postedAt.seconds * 1000 
                          : hotel.postedAt
                      ).toLocaleDateString() 
                    : 'N/A'}
                </td>
                <td>
                  {hotel.status !== 'approved' && (
                    <button 
                      className={styles.approveButton}
                      onClick={() => handleApprove(hotel.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className={styles.deleteButton}
                    onClick={() => handleDelete(hotel.id)}
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

export default CustomerHotels;
