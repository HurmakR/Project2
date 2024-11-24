import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation

const Login = ({ setUserRole }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/accounts/login/', {
                username,
                password,
            });

            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            const userInfoResponse = await axios.get('http://localhost:8000/api/accounts/user-info/', {
                headers: {
                    Authorization: `Bearer ${response.data.access}`,
                },
            });

            setUserRole(userInfoResponse.data.role);
            setError(null);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <form onSubmit={handleLogin} className="card card-body">
                    <h2 className="text-center">Login</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                        Login
                    </button>
                    <p className="mt-3 text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary">
                            Register here
                        </Link>
                    </p>
                    <p className="mt-3 text-center">
                        Forgot your password?{' '}
                        <Link to="/reset-password" className="text-primary">
                            Reset it here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
