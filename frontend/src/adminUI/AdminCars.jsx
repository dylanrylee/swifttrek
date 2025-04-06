import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminServices.module.css';

const AdminCars = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filter cars based on search term
  const filteredCars = cars.filter(car => 
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.id.includes(searchTerm)
  );

  return (
    <div className={styles.serviceContainer}>
      <div className={styles.header}>
        <h1>Car Rental Management</h1>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/admin')}
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search cars..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={styles.addButton}
          onClick={() => navigate('/admin/cars/new')}
        >
          Add New Car
        </button>
      </div>

      <div className={styles.listContainer}>
        {filteredCars.length > 0 ? (
          <table className={styles.listTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Model</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.map(car => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.model}</td>
                  <td>
                    <span className={`${styles.status} ${car.available ? styles.available : styles.unavailable}`}>
                      {car.available ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.actionButton}
                      onClick={() => navigate(`/admin/cars/${car.id}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noResults}>No cars found</p>
        )}
      </div>
    </div>
  );
};

export default AdminCars;