// src/adminUI/BusinessHotels.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, addDocument, deleteDocument } from './firebaseService';
import styles from './BusinessListings.module.css';

const BusinessHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHotel, setNewHotel] = useState({
    name: '',
    location: '',
    price: ''
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getCollectionData('businessHotels');
        setHotels(data);
      } catch (error) {
        console.error('Error fetching business hotels:', error);
      }
      setLoading(false);
    };

    fetchHotels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHotel((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const newListing = {
        ...newHotel,
        price: parseFloat(newHotel.price),
        postedAt: new Date()
      };
      const docId = await addDocument('businessHotels', newListing);
      setHotels([...hotels, { id: docId, ...newListing }]);
      setNewHotel({ name: '', location: '', price: '' });
    } catch (error) {
      console.error('Error adding new business hotel:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('businessHotels', id);
      setHotels(hotels.filter((hotel) => hotel.id !== id));
    } catch (error) {
      console.error('Error deleting business hotel:', error);
    }
  };

  if (loading) return <div>Loading business hotel listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Business Hotel Listings</h2>

      <form onSubmit={handleAddHotel} className={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={newHotel.location}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newHotel.price}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.button}>
          Add Hotel
        </button>
      </form>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>Location</th>
            <th>Price</th>
            <th>Posted Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id}>
              <td>{hotel.name}</td>
              <td>{hotel.location}</td>
              <td>${hotel.price}</td>
              <td>
                {new Date(
                  hotel.postedAt.seconds
                    ? hotel.postedAt.seconds * 1000
                    : hotel.postedAt
                ).toLocaleDateString()}
              </td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(hotel.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BusinessHotels;
