// BusinessFlights.jsx
import React, { useState, useEffect } from 'react';
import { getCollectionData, addDocument, deleteDocument } from './firebaseService';
import styles from './BusinessListings.module.css';

const BusinessFlights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFlight, setNewFlight] = useState({
    airline: '',
    route: '',
    price: ''
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await getCollectionData('businessFlights');
        console.log('Fetched flights:', data);
        setFlights(data);
      } catch (error) {
        console.error('Error fetching business flights:', error);
      }
      setLoading(false);
    };

    fetchFlights();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlight((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFlight = async (e) => {
    e.preventDefault();
    try {
      // Build the new listing. Adjust the fields if needed.
      const newListing = {
        ...newFlight,
        price: parseFloat(newFlight.price),
        postedAt: new Date()
      };
      const docId = await addDocument('businessFlights', newListing);
      setFlights((prevFlights) => [...prevFlights, { id: docId, ...newListing }]);
      setNewFlight({ airline: '', route: '', price: '' });
    } catch (error) {
      console.error('Error adding new business flight:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument('businessFlights', id);
      setFlights((prevFlights) => prevFlights.filter((flight) => flight.id !== id));
    } catch (error) {
      console.error('Error deleting business flight:', error);
    }
  };

  if (loading) return <div>Loading business flight listings...</div>;

  return (
    <div className={styles.container}>
      <h2>Business Flight Listings</h2>

      <form onSubmit={handleAddFlight} className={styles.form}>
        <input
          type="text"
          name="airline"
          placeholder="Airline"
          value={newFlight.airline}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <input
          type="text"
          name="route"
          placeholder="Route (e.g., NYC-LON)"
          value={newFlight.route}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFlight.price}
          onChange={handleInputChange}
          required
          className={styles.inputField}
        />
        <button type="submit" className={styles.button}>
          Add Flight
        </button>
      </form>

      {flights.length === 0 ? (
        <p>No flight listings available.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Airline</th>
              <th>Route</th>
              <th>Price</th>
              <th>Posted Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.airline}</td>
                <td>{flight.route}</td>
                <td>${flight.price}</td>
                <td>
                  {flight.postedAt ? new Date(
                    flight.postedAt.seconds
                      ? flight.postedAt.seconds * 1000
                      : flight.postedAt
                  ).toLocaleDateString() : 'N/A'}
                </td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(flight.id)}
                  >
                    Delete
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

export default BusinessFlights;
