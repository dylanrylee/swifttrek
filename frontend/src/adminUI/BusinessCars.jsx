// BusinessCars.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, addDocument, deleteDocument } from './firebaseService';
import styles from './BusinessListings.module.css';

const BusinessCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCar, setNewCar] = useState({
    companyName: '',
    model: '',
    pricePerDay: ''
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await getCollectionData('businessCars');
      setCars(data);
    } catch (error) {
      console.error("Error fetching business cars: ", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDocument('businessCars', id);
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Error deleting business car: ", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCar(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      // Add a timestamp; Firestore can accept JS Dates.
      const listing = { 
        ...newCar, 
        pricePerDay: parseFloat(newCar.pricePerDay), 
        postedAt: new Date() 
      };
      const id = await addDocument('businessCars', listing);
      setCars([...cars, { id, ...listing }]);
      // Reset form fields
      setNewCar({
        companyName: '',
        model: '',
        pricePerDay: ''
      });
    } catch (error) {
      console.error("Error adding new business car: ", error);
    }
  };

  if (loading) return <div>Loading business car listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Business Car Listings</h2>
      
      <form onSubmit={handleAddCar} className={styles.form}>
        <input 
          type="text" 
          name="companyName" 
          placeholder="Company Name" 
          value={newCar.companyName} 
          onChange={handleInputChange} 
          required
          className={styles.inputField}
        />
        <input 
          type="text" 
          name="model" 
          placeholder="Model" 
          value={newCar.model} 
          onChange={handleInputChange} 
          required
          className={styles.inputField}
        />
        <input 
          type="number" 
          name="pricePerDay" 
          placeholder="Price Per Day" 
          value={newCar.pricePerDay} 
          onChange={handleInputChange} 
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.button}>Add Car</button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Model</th>
            <th>Price Per Day</th>
            <th>Posted Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.id}>
              <td>{car.companyName}</td>
              <td>{car.model}</td>
              <td>${car.pricePerDay}</td>
              <td>{new Date(car.postedAt.seconds ? car.postedAt.seconds * 1000 : car.postedAt).toLocaleDateString()}</td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDelete(car.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessCars;
