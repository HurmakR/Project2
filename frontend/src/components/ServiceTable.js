import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceTable = ({ userRole }) => {
    const [categories, setCategories] = useState([]);
    const [series, setSeries] = useState([]);
    const [models, setModels] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    // Fetch categories on mount
    useEffect(() => {
        axios.get('http://localhost:8000/api/pricelist/categories/').then((response) => {
            setCategories(response.data);
        });
    }, []);

    // Fetch series when a category is selected
    useEffect(() => {
        if (selectedCategory) {
            axios
                .get('http://localhost:8000/api/pricelist/series/')
                .then((response) => {
                    setSeries(response.data.filter((s) => s.category === selectedCategory));
                    setModels([]); // Reset models
                    setServices([]); // Reset services
                });
        } else {
            setSeries([]); // Reset series if no category is selected
            setModels([]); // Reset models
            setServices([]); // Reset services
        }
    }, [selectedCategory]);

    // Fetch models when a series is selected
    useEffect(() => {
        if (selectedSeries) {
            axios
                .get('http://localhost:8000/api/pricelist/models/')
                .then((response) => {
                    setModels(response.data.filter((m) => m.series === selectedSeries));
                    setServices([]); // Reset services
                });
        } else {
            setModels([]); // Reset models if no series is selected
            setServices([]); // Reset services
        }
    }, [selectedSeries]);

    // Fetch services when a model is selected
    useEffect(() => {
        if (selectedModel) {
            axios
                .get('http://localhost:8000/api/pricelist/repair-prices/')
                .then((response) => {
                    setServices(response.data.filter((s) => s.model === selectedModel));
                });
        } else {
            setServices([]); // Reset services if no model is selected
        }
    }, [selectedModel]);

    return (
        <div className="container">
            <h2 className="text-center my-4">Service Prices</h2>

            {/* Selectors in a row */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <label>Category:</label>
                    <select
                        name="category"
                        id="category"
                        className="form-control bg-dark text-light"
                        value={selectedCategory || ''}
                        onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : null;
                            setSelectedCategory(value);
                            setSelectedSeries(null); // Reset series when category changes
                            setSelectedModel(null); // Reset model when category changes
                        }}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCategory && (
                    <div className="col-md-4">
                        <label>Series:</label>
                        <select
                            name="series"
                            id="series"
                            className="form-control bg-dark text-light"
                            value={selectedSeries || ''}
                            onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : null;
                                setSelectedSeries(value);
                                setSelectedModel(null); // Reset model when series changes
                            }}
                        >
                            <option value="">Select a series</option>
                            {series.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedSeries && (
                    <div className="col-md-4">
                        <label>Model:</label>
                        <select
                            name="model"
                            id="model"
                            className="form-control bg-dark text-light"
                            value={selectedModel || ''}
                            onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : null;
                                setSelectedModel(value);
                            }}
                        >
                            <option value="">Select a model</option>
                            {models.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Services Table */}
            {selectedModel && services.length > 0 && (
                <div>
                    <h3>{models.find((m) => m.id === selectedModel)?.name || 'No Model Selected'}</h3>
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Exchange Price</th>
                                <th>Stock Price</th>
                                {userRole !== 'end_user' && <th>Dealer Exchange Price</th>}
                                {userRole !== 'end_user' && <th>Dealer Stock Price</th>}
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id}>
                                    <td>{service.repair_type?.name || '-'}</td>
                                    <td>{service.retail_exchange_price || '-'}</td>
                                    <td>{service.retail_stock_price || '-'}</td>
                                    {userRole !== 'end_user' && <td>{service.dealer_exchange_price || '-'}</td>}
                                    {userRole !== 'end_user' && <td>{service.dealer_stock_price || '-'}</td>}
                                    <td>{service.description || '*'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ServiceTable;
