import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SelectAccountType from './guestUI/SelectAccountType';
import GuestLogin from './guestUI/GuestLogin';
import GuestHomePage from './guestUI/GuestHomePage';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SelectAccountType />} />
                <Route path="/guest-login" element={<GuestLogin />} />
                <Route path="/guest-home" element={<GuestHomePage />} />
            </Routes>
        </Router>
    );
};

export default App;