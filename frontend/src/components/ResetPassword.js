import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleResetPasswordRequest = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/accounts/reset-password/', {
                email,
            });

            setMessage(response.data.message);
            setError(null);
        } catch (err) {
            setError('Failed to send reset password email. Please check the email address.');
            setMessage(null);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleResetPasswordRequest} className="card card-body">
                    <h2 className="text-center">Reset Password</h2>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Send Reset Link
                    </button>
                    <p className="mt-3 text-center">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-primary">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
