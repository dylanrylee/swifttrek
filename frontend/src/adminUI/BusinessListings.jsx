import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BusinessListings.module.css'; 

const BusinessListings = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.listingsContainer}>
      <h2 className={styles.header}>Business Listings</h2>
      <div className={styles.buttonsContainer}>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/business/cars')}
        >
          Business Cars
        </button>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/business/hotels')}
        >
          Business Hotels
        </button>
        <button 
          className={styles.listingButton}
          onClick={() => navigate('/admin/business/flights')}
        >
          Business Flights
        </button>
      </div>
    </div>
  );
};

export default BusinessListings;
