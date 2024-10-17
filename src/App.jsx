import React, { useState, useEffect } from 'react';
import { fetchWeather, fetchCitySuggestions, fetchWeatherByCoordinates } from './api';
import Weather from './Weather';
import debounce from 'lodash/debounce';

const RECENT_SEARCHES_KEY = 'recentSearches';

const App = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);

  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      const data = await fetchWeatherByCoordinates(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError('Unable to fetch weather for your location.');
    }
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
      updateRecentSearches(city, data);
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

      <div>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Weather weatherData={weatherData} />
    </div>
  );
};

export default App;
