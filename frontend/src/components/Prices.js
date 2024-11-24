import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Prices = ({ userRole }) => {
    const [prices, setPrices] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/pricelist/repair-prices/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                const filteredPrices = response.data.map((price) => {
                    if (userRole === 'admin' || userRole === 'staff') {
                        return price;
                    } else if (userRole === 'dealer') {
                        return {
                            ...price,
                            retail_stock_price: null,
                            retail_exchange_price: null,
                        };
                    } else if (userRole === 'end_user') {
                        return {
                            ...price,
                            dealer_stock_price: null,
                            dealer_exchange_price: null,
                        };
                    }
                    return price;
                });

                setPrices(filteredPrices);
                setError(null);
            } catch (err) {
                console.error('Error fetching prices:', err);
                setError('Failed to load prices');
            }
        };

        fetchPrices();
    }, [userRole]);

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const headers =
        userRole === 'admin' || userRole === 'staff'
            ? ['Repair Type', 'Exchange Price', 'Full Price', 'Exchange Price, Dealer', 'Full Price, Dealer']
            : ['Repair Type', 'Exchange Price', 'Full Price'];

    return (
        <div className="table-responsive">
            <h2 className="mb-4 text-center">Prices</h2>
            <table className="table table-bordered table-striped">
                <thead className="thead-dark">
                    <tr>
                        {headers.map((header, index) => (
                            <th key={index}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {prices.map((price) => (
                        <tr key={price.id}>
                            <td>{price.repair_type.name} </td>
                            {userRole === 'admin' || userRole === 'staff' ? (
                                <>
                                    <td>{price.retail_exchange_price || '-'}</td>
                                    <td>{price.retail_stock_price || '-'}</td>
                                    <td>{price.dealer_exchange_price || '-'}</td>
                                    <td>{price.dealer_stock_price || '-'}</td>
                                </>
                            ) : (
                                <>
                                    <td>
                                        {userRole === 'dealer'
                                            ? price.dealer_exchange_price || '-'
                                            : price.retail_exchange_price || '-'}
                                    </td>
                                    <td>
                                        {userRole === 'dealer'
                                            ? price.dealer_stock_price || '-'
                                            : price.retail_stock_price || '-'}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Prices;
