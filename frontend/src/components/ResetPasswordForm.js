import React, { useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'; // Import Link for navigation

const ResetPasswordForm = () => {
    const { userId } = useParams(); // Get userId from URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/reset-password/${userId}/`, {
                password,
            });

            setMessage(response.data.message);
            setError(null);
        } catch (err) {
            setError('Failed to reset password. Please try again.');
            setMessage(null);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handlePasswordReset} className="card card-body">
                    <h2 className="text-center">Reset Password</h2>
                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Reset Password
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

export default ResetPasswordForm;
