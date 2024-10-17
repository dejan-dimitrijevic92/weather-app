import React, { useState, useEffect } from 'react';
import { fetchWeather, fetchCitySuggestions, fetchWeatherByCoordinates } from './api';
import Weather from './Weather';
import debounce from 'lodash/debounce';
import './styles.css';

const RECENT_SEARCHES_KEY = 'recentSearches';

const App = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState('');

  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const data = await fetchWeatherByCoordinates(lat, lon);
      setWeatherData(data);
      updateBackground(data);
    } catch (err) {
      setError('Unable to fetch weather for your location.');
    }
  };

  const updateBackground = (data) => {
    const { timezone } = data;
    const localTime = new Date(Date.now() + timezone * 1000);
    const hour = localTime.getHours();
  
    const condition = data.weather[0].main.toLowerCase();
    let gradient = '';

    if (condition.includes('clear')) {
      gradient = hour >= 18 ? 'linear-gradient(to bottom, #2c3e50, #34495e)' : 'linear-gradient(to bottom, #2980b9, #6dd5ed)';
    } else if (condition.includes('cloud')) {
      gradient = hour >= 18 ? 'linear-gradient(to bottom, #34495e, #2c3e50)' : 'linear-gradient(to bottom, #bdc3c7, #2c3e50)';
    } else if (condition.includes('rain')) {
      gradient = 'linear-gradient(to bottom, #2c3e50, #bdc3c7)';
    } else if (condition.includes('snow')) {
      gradient = 'linear-gradient(to bottom, #ecf0f1, #bdc3c7)';
    } else {
      gradient = 'linear-gradient(to bottom, #3498db, #ecf0f1)'; // Default gradient
    }
  
    setBackground(gradient);
  };  

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByLocation(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          fetchWeatherFallback();
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      fetchWeatherFallback();
    }
  };

  const fetchWeatherFallback = async () => {
    try {
      const data = await fetchWeather('New York');
      setWeatherData(data);
      updateBackground(data);
    } catch (err) {
      setError('Unable to fetch weather data for the fallback city.');
    }
  };

  useEffect(() => {
    getLocation();
    const storedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];
    setRecentSearches(storedSearches);
  }, []);

  const updateRecentSearches = (city, data) => {
    const updatedSearches = recentSearches.filter((search) => search.city !== city);
    updatedSearches.unshift({ city, data });

    if (updatedSearches.length > 3) {
      updatedSearches.pop();
    }

    setRecentSearches(updatedSearches);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updatedSearches));
  };

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
  };

  const handleCitySelect = (suggestion) => {
    setCity(`${suggestion.name}, ${suggestion.country}`);
    setSuggestions([]);
  };

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
      updateRecentSearches(city, data);
      updateBackground(data);
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
    <div className="container" style={{ background: background, transition: 'background 0.5s ease' }}>
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        className="search-input"
        placeholder="Enter city name"
      />
      <button onClick={handleSearch} className="search-button">Search</button>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion-item" onClick={() => handleCitySelect(suggestion)}>
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-message">{error}</p>}

      {weatherData && <Weather weatherData={weatherData} />}

      <div className="recent-searches">
        <h2>Recent Searches</h2>
        {recentSearches.length === 0 ? (
          <p>No recent searches.</p>
        ) : (
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>
                {search.city}: {search.data.main.temp} °C, {search.data.weather[0].description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
