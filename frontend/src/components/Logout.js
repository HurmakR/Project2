import React from 'react';

const Logout = ({ setUserRole }) => {
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUserRole(null);
    };

    return (
        <div className="text-right mb-3">
            <button onClick={handleLogout} className="btn btn-danger">
                Logout
            </button>
        </div>
    );
};

export default Logout;
