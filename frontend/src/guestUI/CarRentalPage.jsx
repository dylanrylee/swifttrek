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
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showRentPopup, setShowRentPopup] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];

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
        setShowRentPopup(false);
        setFromDate('');
        setToDate('');
    };

    const handleRentClick = () => {
        setShowRentPopup(true);
    };

    const handleConfirmRental = () => {
        navigate('/payment-checkout', {
            state: {
                selectedCar,
                fromDate,
                toDate,
                pricePerDay: selectedCar.price // Add the price per day here
            }
        });
    };
    

    // Updated Write Review click handler: passes carId along with other car details.
    const handleWriteReviewClick = () => {
        if (!selectedCar) return;
    
        navigate('/write-review', {
            state: {
                carId: selectedCar.id,
                model: selectedCar.model,
                type: selectedCar.type,
                location: selectedCar.location
            }
        });
    };

    const filteredCars = cars.filter((car) => {
        const matchesText = `${car.model} ${car.type} ${car.location}`.toLowerCase().includes(searchQuery.toLowerCase());
        const price = parseFloat(car.price);
        const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        return matchesText && matchesMin && matchesMax;
    });

    const handleViewReviewsClick = () => {
        if (!selectedCar) return;
        navigate(`/reviews/${selectedCar.id}`);
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} />
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Car Rental</h1>

                    <div className={styles.searchBarContainer}>
                        <input
                            type="text"
                            placeholder="Search by model, type, or location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <div className={styles.priceInputs}>
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                            <input
                                type="number"
                                placeholder="Max Price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                        </div>
                    </div>

                    <div className={styles.tableContainer}>
                        <table className={styles.carTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Location</th> {/* Added Location header */}
                                    <th>Price/Day</th>
                                    <th>Availability</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car) => (
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
                                        <td>{car.location}</td> {/* Display car location */}
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
                                <p><strong>Type:</strong> {selectedCar.type}</p>
                                <p><strong>Location:</strong> {selectedCar.location}</p>
                                <p><strong>Price per Day:</strong> ${selectedCar.price}</p>
                                <p><strong>Availability:</strong> {selectedCar.availability}</p>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.rentButton} onClick={handleRentClick}>
                                        Rent
                                    </button>
                                    <button className={styles.cancelButton} onClick={handleClosePopup}>
                                        Cancel
                                    </button>
                                </div>
                                <div className={styles.reviewSection}>
                                    <button className={styles.yellowButton} onClick={handleWriteReviewClick}>
                                        Write Review
                                    </button>
                                    <button className={styles.yellowButton} onClick={handleViewReviewsClick}>
                                        View Reviews
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showRentPopup && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>Rental Dates for {selectedCar?.model}</h2>
                                <label>
                                    From Date:
                                    <input
                                        type="date"
                                        min={today}
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                    />
                                </label>
                                <br />
                                <label>
                                    To Date:
                                    <input
                                        type="date"
                                        min={fromDate || today}
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                    />
                                </label>
                                <br />
                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.confirmButton}
                                        onClick={handleConfirmRental}
                                        disabled={!fromDate || !toDate}
                                    >
                                        Confirm Booking
                                    </button>
                                    <button
                                        className={styles.cancelButton1}
                                        onClick={() => setShowRentPopup(false)}
                                    >
                                        Cancel
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
