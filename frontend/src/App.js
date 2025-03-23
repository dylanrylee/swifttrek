import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SelectAccountType from './guestUI/SelectAccountType';
import GuestLogin from './guestUI/GuestLogin';
import GuestHomePage from './guestUI/GuestHomePage';
import PaymentCheckout from './guestUI/PaymentCheckout';
import WriteReviewPage from './guestUI/WriteReviewPage';
import CarRentalPage from './guestUI/CarRentalPage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SelectAccountType />} />
                <Route path="/guest-login" element={<GuestLogin />} />
                <Route path="/guest-home" element={<GuestHomePage />} /> 
                <Route path="/payment-checkout" element={<PaymentCheckout />} />
                <Route path="/write-review" element={<WriteReviewPage />} />
                <Route path="/car-rental" element={<CarRentalPage />} />
            </Routes>
        </Router>
    );
};

export default App;
