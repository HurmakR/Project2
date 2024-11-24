import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Register = ({ setUserRole }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            //const registerResponse =
            await axios.post('http://localhost:8000/api/accounts/register/', {
                username,
                email,
                password,
            });

            const loginResponse = await axios.post('http://localhost:8000/api/accounts/login/', {
                username,
                password,
            });

            localStorage.setItem('access_token', loginResponse.data.access);
            localStorage.setItem('refresh_token', loginResponse.data.refresh);

            const userInfoResponse = await axios.get('http://localhost:8000/api/accounts/user-info/', {
                headers: {
                    Authorization: `Bearer ${loginResponse.data.access}`,
                },
            });

            setUserRole(userInfoResponse.data.role);
            setError(null);
        } catch (err) {
            setError('Registration or login failed. Please try again.');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleRegister} className="card card-body">
                    <h2 className="text-center">Register</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Register
                    </button>
                    <p className="mt-3 text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
