import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './CarRentalPage.module.css';
import Header from './Header';
import Footer from './Footer';

const CarRentalPage = () => {
    const [cars, setCars] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'cars'));
                const carList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCars(carList);
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchCars();
    }, []);

    const handleDetailsClick = (car) => {
        setSelectedCar(car);
        setShowDetails(true);
    };

    const handleClosePopup = () => {
        setSelectedCar(null);
        setShowDetails(false);
    };

    const handleRentClick = () => {
        navigate('/payment-checkout');
    };

    const handleWriteReviewClick = () => {
        navigate('/write-review');
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Car Rental</h1>
                    <div className={styles.tableContainer}>
                        <table className={styles.carTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Price/Day</th>
                                    <th>Availability</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cars.map((car) => (
                                    <tr key={car.id}>
                                        <td>
                                            {car.imageUrl && (
                                                <img
                                                    src={car.imageUrl}
                                                    alt={car.model}
                                                    className={styles.thumbnail}
                                                />
                                            )}
                                        </td>
                                        <td>{car.model}</td>
                                        <td>{car.type}</td>
                                        <td>${car.price}</td>
                                        <td>{car.availability}</td>
                                        <td>
                                            <button
                                                className={styles.detailsButton}
                                                onClick={() => handleDetailsClick(car)}
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showDetails && selectedCar && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>{selectedCar.model} Details</h2>
                                {selectedCar.imageUrl && (
                                    <img
                                        src={selectedCar.imageUrl}
                                        alt={selectedCar.model}
                                        className={styles.carImage}
                                    />
                                )}
                                <p><strong>Car ID:</strong> {selectedCar.carId}</p>
                                <p><strong>Company ID:</strong> {selectedCar.companyId}</p>
                                <p><strong>Type:</strong> {selectedCar.type}</p>
                                <p><strong>Location:</strong> {selectedCar.location}</p>
                                <p><strong>Price per Day:</strong> ${selectedCar.price}</p>
                                <p><strong>Availability:</strong> {selectedCar.availability}</p>
                                <p><strong>Average Rating:</strong> {selectedCar.avgRating ?? 'N/A'} / 5</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.rentButton} onClick={handleRentClick}>
                                        Rent
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>
                                <h3>Reviews</h3>
                                <div className={styles.reviewsSection}>
                                    <p>No reviews yet.</p>
                                    <button className={styles.writeReviewButton} onClick={handleWriteReviewClick}>
                                        Write a Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CarRentalPage;
