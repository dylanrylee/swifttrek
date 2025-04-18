import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase configuration
import styles from './CarRentalPage.module.css'; 
import Header from './Header';
import Footer from './Footer';

const CarRentalPage = () => {
    const [cars, setCars] = useState([]); // All cars are getting fetched from the firestore
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showRentPopup, setShowRentPopup] = useState(false);
    const [fromDate, setFromDate] = useState(''); // This is for the rental start date
    const [toDate, setToDate] = useState(''); // This is for the rental end date
    const navigate = useNavigate(); // We need this for navigating between the pages

    // Get the current date 
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                // get all the documents from the cars collection from firebase
                const querySnapshot = await getDocs(collection(db, 'cars'));
                const carList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setCars(carList); // save the cars to state
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchCars(); // this is a initial fetch call
    }, []);

    // show the details popup when you select a car
    const handleDetailsClick = (car) => {
        setSelectedCar(car);
        setShowDetails(true);
    };

    // close all of the popups 
    const handleClosePopup = () => {
        setSelectedCar(null);
        setShowDetails(false);
        setShowRentPopup(false);
        setFromDate('');
        setToDate('');
    };

    // open the rent date selection popup
    const handleRentClick = () => {
        setShowRentPopup(true);
    };

    // navigate to payment checkout, including the necessary info for that page
    const handleConfirmRental = () => {
        navigate('/payment-checkout', {
            state: {
                selectedCar,
                fromDate,
                toDate,
                pricePerDay: selectedCar.price
            }
        });
    };
    

    // navigate to write review, passing necessary info for that page
    const handleWriteReviewClick = () => {
        if (!selectedCar) return;
    
        navigate('/write-review', {
            state: {
                carId: selectedCar.carId,
                model: selectedCar.model,
                type: selectedCar.type,
                location: selectedCar.location
            }
        });
    };

    // this filters the cars by the matched text, price, and their availability
    const filteredCars = cars.filter((car) => {
        const matchesText = `${car.model} ${car.type} ${car.location}`.toLowerCase().includes(searchQuery.toLowerCase());
        const price = parseFloat(car.price);
        const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        const isAvailable = car.availability === 'Available';

        return matchesText && matchesMin && matchesMax && isAvailable;
    });

    // this navigates to view reviews for the car you have selected
    const handleViewReviewsClick = () => {
        if (!selectedCar) return;
        navigate(`/view-car-reviews/${selectedCar.carId}`, {
            state: {
                carId: selectedCar.carId,
                model: selectedCar.model,
                type: selectedCar.type,
                location: selectedCar.location
            }
        });
    };

    return (
        <div className={styles.container}>
            <Header hideTabs={false} /> {/* This sets the hideTabs as false, so you can see the header */}
            <div className={styles.content}>
                <div className={styles.whiteBox}>
                    <h1 className={styles.heading}>Car Rental</h1>

                    <div className={styles.searchBarContainer}>
                        {/* This shows the search my model, type, or location */}
                        <input
                            type="text"
                            placeholder="Search by model, type, or location"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <div className={styles.priceInputs}>
                            {/* This shows to search for your preferred minimum price */}
                            <input
                                type="number"
                                placeholder="Min Price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className={styles.priceInput}
                            />
                            {/* This shows to search for your preferred maximum price */}
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
                        {/* Displays car details */}
                        <table className={styles.carTable}>
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Model</th>
                                    <th>Type</th>
                                    <th>Location</th>
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
                                        <td>{car.location}</td>
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

                    {/* This pops up a modal to show the details of the car, showing the rent buttons, and the view and write reviews as well */}
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

                    {/* This shows the modal for if you do want to rent */}
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
            {/* This displays the footer */}
            <Footer />
        </div>
    );
};

export default CarRentalPage;
