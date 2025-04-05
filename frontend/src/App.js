import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // react router dom
import { AuthProvider } from "./AuthContext"; // import Auth Context

const SelectAccountType = lazy(() => import("./guestUI/SelectAccountType"));
const GuestLogin = lazy(() => import("./guestUI/GuestLogin"));
const GuestHomePage = lazy(() => import("./guestUI/GuestHomePage"));
const PaymentCheckout = lazy(() => import("./guestUI/PaymentCheckout"));
const WriteReviewPage = lazy(() => import("./guestUI/WriteReviewPage"));
const CarRentalPage = lazy(() => import("./guestUI/CarRentalPage"));
const HotelRentalPage = lazy(() => import("./guestUI/HotelRentalPage"));
const PlaneBookingPage = lazy(() => import("./guestUI/PlaneBookingPage"));


const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<SelectAccountType />} />
                        <Route path="/guest-login" element={<GuestLogin />} />
                        <Route path="/guest-home" element={<GuestHomePage />} /> 
                        <Route path="/payment-checkout" element={<PaymentCheckout />} />
                        <Route path="/write-review" element={<WriteReviewPage />} />
                        <Route path="/car-rental" element={<CarRentalPage />} />
                        <Route path="/hotel-rental" element={<HotelRentalPage />} />
                        <Route path="/plane-booking" element={<PlaneBookingPage />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
};

export default App;
