
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BusinessListings.module.css'; // Reusing the shared CSS module

const CustomerListings = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.listingsContainer}>
      <h2 className={styles.header}>Customer Listings</h2>
      <div className={styles.buttonsContainer}>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/customer/cars')}
        >
          Customer Cars
        </button>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/customer/hotels')}
        >
          Customer Hotels
        </button>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/customer/flights')}
        >
          Customer Flights
        </button>
      </div>
    </div>
  );
};

export default CustomerListings;
