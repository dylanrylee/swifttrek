// src/adminUI/CustomerCars.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, deleteDocument } from './firebaseService';
import { updateDoc, doc } from "firebase/firestore";
import { db } from './firebase';
import styles from './BusinessListings.module.css';

const CustomerCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer car listings
  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData('customerCars');
      setCars(data);
    } catch (error) {
      console.error("Error fetching customer cars:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Update document field "status" to "approved"
  const handleApprove = async (id) => {
    try {
      const carRef = doc(db, 'customerCars', id);
      await updateDoc(carRef, { status: 'approved' });
      setCars((prevCars) =>
        prevCars.map((car) => (car.id === id ? { ...car, status: 'approved' } : car))
      );
    } catch (error) {
      console.error("Error approving customer car:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('customerCars', id);
      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Error deleting customer car:", error);
    }
  };

  if (loading) return <div>Loading customer car listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Customer Car Listings</h2>
      {cars.length === 0 ? (
        <p>No customer car listings available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Model</th>
              <th>Price</th>
              <th>Status</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td>{car.model}</td>
                <td>${car.price}</td>
                <td>{car.status || 'pending'}</td>
                <td>
                  {car.postedAt 
                    ? new Date(
                        car.postedAt.seconds
                          ? car.postedAt.seconds * 1000
                          : car.postedAt
                      ).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td>
                  {car.status !== 'approved' && (
                    <button 
                      className={styles.button} 
                      onClick={() => handleApprove(car.id)}
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    className={styles.deleteButton} 
                    onClick={() => handleDelete(car.id)}
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

export default CustomerCars;
