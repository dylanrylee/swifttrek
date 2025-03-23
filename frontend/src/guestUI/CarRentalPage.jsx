// Import necessary libraries and components
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CarRentalPage.module.css';
import Header from './Header';
import Footer from './Footer';

// Array of car objects with basic information
const cars = [
    { id: 1, name: 'Car 1', price: 45, avgRating: 4, type: 'Truck', seats: 2, condition: 'Excellent' },
    { id: 2, name: 'Car 2', price: 90, avgRating: 5, type: 'Sports', seats: 2, condition: 'Good' },
    { id: 3, name: 'Car 3', price: 70, avgRating: 3, type: 'SUV', seats: 6, condition: 'Average' },
];

const CarRentalPage = () => {
    // State variables to manage selected car and popup visibility
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Handle the click event to show car details
    const handleDetailsClick = (car) => {
        setSelectedCar(car); // Update selected car
        setShowDetails(true); // Show popup
    };

    // Close the popup when clicking the cancel button
    const handleClosePopup = () => {
        setSelectedCar(null);
        setShowDetails(false);
    };

    return (
        // Main container for the car rental page
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <h1 className={styles.heading}>Car Rental</h1>
                <table className={styles.carTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price per Day</th>
                            <th>Average Rating</th>
                            <th>Action</th> {/* Action button for details */}
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car.id}> {/* Unique key for each car */}
                                <td>{car.name}</td>
                                <td>${car.price}</td>
                                <td>{car.avgRating} / 5</td>
                                <td>
                                    <button className={styles.detailsButton} onClick={() => handleDetailsClick(car)}>
                                        Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showDetails && selectedCar && (
                    // Popup to display detailed car information
                    <div className={styles.popup}>
                        <div className={styles.popupContent}>
                            <h2>{selectedCar.name} Details</h2>
                            <p>Type: {selectedCar.type}</p>
                            <p>Seats: {selectedCar.seats}</p>
                            <p>Price per Day: ${selectedCar.price}</p>
                            <p>Condition: {selectedCar.condition}</p>
                            <p>Average Rating: {selectedCar.avgRating} / 5</p>
                            <div className={styles.buttonContainer}>
                                <button className={styles.rentButton}>Rent</button>
                                <button className={styles.cancelButton} onClick={handleClosePopup}>Cancel</button>
                            </div>
                            <h3>Reviews</h3>
                            <div className={styles.reviewsSection}>
                                <p>No reviews yet.</p> {/* Placeholder for reviews */}
                                <Link to="/write-review" className={styles.writeReviewLink}>Write a Review</Link> {/*Right now does not go anywhere, will implement later */}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CarRentalPage;
