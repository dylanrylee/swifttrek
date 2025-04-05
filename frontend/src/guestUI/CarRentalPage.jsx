import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CarRentalPage.module.css';
import Header from './Header';
import Footer from './Footer';

const cars = [
    { id: 1, name: 'Car 1', price: 45, avgRating: 4, type: 'Truck', seats: 2, condition: 'Excellent' },
    { id: 2, name: 'Car 2', price: 90, avgRating: 5, type: 'Sports', seats: 2, condition: 'Good' },
    { id: 3, name: 'Car 3', price: 70, avgRating: 3, type: 'SUV', seats: 6, condition: 'Average' },
];

const CarRentalPage = () => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
<<<<<<< Updated upstream
    const navigate = useNavigate(); 
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        navigate('/payment-checkout'); 
=======
        setShowRentPopup(true);
    };

    const handleConfirmRental = () => {
        navigate('/payment-checkout', {
            state: {
                selectedCar,
                fromDate,
                toDate
            }
        });
>>>>>>> Stashed changes
    };

    const handleWriteReviewClick = () => {
        navigate('/write-review'); 
    };

    const filteredCars = cars.filter((car) => {
        const matchesText = `${car.model} ${car.type} ${car.location}`.toLowerCase().includes(searchQuery.toLowerCase());
        const price = parseFloat(car.price);
        const matchesMin = minPrice ? price >= parseFloat(minPrice) : true;
        const matchesMax = maxPrice ? price <= parseFloat(maxPrice) : true;
        return matchesText && matchesMin && matchesMax;
    });

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
                                    <th>Name</th>
                                    <th>Price per Day</th>
                                    <th>Average Rating</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map((car) => (
                                    <tr key={car.id}>
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
                    </div>
                    {showDetails && selectedCar && (
                        <div className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h2>{selectedCar.name} Details</h2>
                                <p>Type: {selectedCar.type}</p>
                                <p>Seats: {selectedCar.seats}</p>
                                <p>Price per Day: ${selectedCar.price}</p>
                                <p>Condition: {selectedCar.condition}</p>
                                <p>Average Rating: {selectedCar.avgRating} / 5</p>
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
                                        Confirm
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
