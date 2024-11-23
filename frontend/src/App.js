import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [categories, setCategories] = useState([]); // Categories state
    const [series, setSeries] = useState([]); // Series state
    const [models, setModels] = useState([]); // Models state
    const [prices, setPrices] = useState([]); // All prices state
    const [filteredPrices, setFilteredPrices] = useState([]); // Filtered prices state

    const [selectedCategory, setSelectedCategory] = useState(null); // Selected category
    const [selectedSeries, setSelectedSeries] = useState(null); // Selected series
    const [selectedModel, setSelectedModel] = useState(null); // Selected model

    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    const BASE_URL = 'http://localhost:8000/api/pricelist/'; // Base API URL

    // Fetch categories, series, models, and prices on mount
    useEffect(() => {
        setLoading(true);

        Promise.all([
            axios.get(`${BASE_URL}categories/`),
            axios.get(`${BASE_URL}series/`),
            axios.get(`${BASE_URL}models/`),
            axios.get(`${BASE_URL}repair-prices/`)
        ])
            .then(([categoriesRes, seriesRes, modelsRes, pricesRes]) => {
                setCategories(categoriesRes.data);
                setSeries(seriesRes.data);
                setModels(modelsRes.data);
                setPrices(pricesRes.data);
                setFilteredPrices(pricesRes.data); // Initially, all prices are shown
                setError(null);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load data');
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter prices whenever category, series, or model changes
    useEffect(() => {
        let filtered = prices;

        if (selectedCategory) {
            filtered = filtered.filter(price => {
                const model = models.find(m => m.id === price.model);
                const seriesItem = series.find(s => s.id === model?.series);
                return seriesItem?.category === parseInt(selectedCategory, 10);
            });
        }

        if (selectedSeries) {
            filtered = filtered.filter(price => {
                const model = models.find(m => m.id === price.model);
                return model?.series === parseInt(selectedSeries, 10);
            });
        }

        if (selectedModel) {
            filtered = filtered.filter(price => price.model === parseInt(selectedModel, 10));
        }

        setFilteredPrices(filtered);
    }, [selectedCategory, selectedSeries, selectedModel, prices, models, series]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Device Repair Price Finder</h1>

            {/* Category selection */}
            <div>
                <h2>Select Category</h2>
                <select
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedSeries(null); // Clear series
                        setSelectedModel(null); // Clear model
                    }}
                    value={selectedCategory || ''}
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            {/* Series selection */}
            {selectedCategory && (
                <div>
                    <h2>Select Series</h2>
                    <select
                        onChange={(e) => {
                            setSelectedSeries(e.target.value);
                            setSelectedModel(null); // Clear model
                        }}
                        value={selectedSeries || ''}
                    >
                        <option value="" disabled>Select a series</option>
                        {series
                            .filter(s => s.category === parseInt(selectedCategory, 10))
                            .map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                    </select>
                </div>
            )}

            {/* Model selection */}
            {selectedSeries && (
                <div>
                    <h2>Select Model</h2>
                    <select
                        onChange={(e) => setSelectedModel(e.target.value)}
                        value={selectedModel || ''}
                    >
                        <option value="" disabled>Select a model</option>
                        {models
                            .filter(m => m.series === parseInt(selectedSeries, 10))
                            .map(m => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                    </select>
                </div>
            )}

            {/* Prices Table */}
            <div>
                <h2>Prices</h2>
                {filteredPrices.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Repair Type</th>
                                <th>Retail Stock Price</th>
                                <th>Retail Exchange Price</th>
                                <th>Dealer Stock Price</th>
                                <th>Dealer Exchange Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPrices.map(price => {
                                const model = models.find(m => m.id === price.model);
                                return (
                                    <tr key={price.id}>
                                        <td>{price.repair_type.name}</td>
                                        <td>{price.retail_stock_price} USD</td>
                                        <td>{price.retail_exchange_price} USD</td>
                                        <td>{price.dealer_stock_price} USD</td>
                                        <td>{price.dealer_exchange_price} USD</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p>No prices available</p>
                )}
            </div>
        </div>
    );
}

export default App;
