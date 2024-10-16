import React, { useState, useEffect } from 'react';
import { fetchWeather, fetchCitySuggestions } from './api';
import Weather from './Weather';
import debounce from 'lodash/debounce';

const App = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const debouncedFetchSuggestions = debounce(async (query) => {
    if (query.length > 2) {
      try {
        const data = await fetchCitySuggestions(query);
        setSuggestions(data);
      } catch (err) {
        setError('Error fetching city suggestions.');
      }
    } else {
      setSuggestions([]);
    }
  }, 300);

  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCity(value);
    setSuggestions([]);
    debouncedFetchSuggestions(value);
  }

  const handleCitySelect = (suggestion) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([])
  }

  const handleSearch = async () => {
    setError(null);
    setWeatherData(null);
    if (!city) {
      setError('Please enter a city name.');
      return;
    }

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError('City not found or API error.');
    }
  };

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, []);

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch}>Search</button>

      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ddd', listStyle: 'none', padding: '0' }}>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleCitySelect(suggestion)}>
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Weather weatherData={weatherData} />
    </div>
  );
};

export default App;
