import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import ResetPasswordForm from './components/ResetPasswordForm';
import Logout from './components/Logout';
import ServiceTable from './components/ServiceTable';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [userRole, setUserRole] = useState(null); // Tracks the role of the logged-in user

    return (
        <Router>
            <div className="container mt-5">
                {!userRole ? (
                    // Render Login/Register/ResetPassword when user is not logged in
                    <Routes>
                        <Route path="/login" element={<Login setUserRole={setUserRole} />} />
                        <Route path="/register" element={<Register setUserRole={setUserRole} />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/reset-password/:userId" element={<ResetPasswordForm />} />
                        <Route path="/" element={<Login setUserRole={setUserRole} />} />
                    </Routes>
                ) : (
                    // Render Logout and ServiceTable for logged-in users
                    <div>
                        <Logout setUserRole={setUserRole} />
                        <ServiceTable userRole={userRole} />
                    </div>
                )}
            </div>
        </Router>
    );
};

export default App;
