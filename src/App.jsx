import React, { useState, useEffect, useRef } from 'react';
import { fetchWeather, fetchCitySuggestions, fetchWeatherByCoordinates } from './api';
import CurrentWeather from './components/CurrentWeather';
import RecentSearches from './components/RecentSearches';
import debounce from 'lodash/debounce';
import './styles.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const RECENT_SEARCHES_KEY = 'recentSearches';

const App = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState(null);
  const [background, setBackground] = useState('');
  const wrapperRef = useRef(null);

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
    const utcTime = Date.now() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezone * 1000);
    const hour = localTime.getHours();
  
    const condition = data.weather[0].main.toLowerCase();
    let backgroundClass = '';

    if (condition.includes('clear')) {
      backgroundClass = hour >= 18 || hour <= 5 ? 'night-clear' : 'day-clear';
    } else if (condition.includes('cloud')) {
      backgroundClass = hour >= 18 || hour <= 5 ? 'night-cloudy' : 'day-cloudy';
    } else if (condition.includes('rain')) {
      backgroundClass = 'rainy';
    } else if (condition.includes('snow')) {
      backgroundClass = 'snowy';
    } else {
      backgroundClass = 'default';
    }
  
    setBackground(backgroundClass);
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
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

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
    handleSearch(`${suggestion.name}, ${suggestion.country}`);
  };

  const handleSearch = async (searchCity) => {
    setError(null);
    setWeatherData(null);
    setSuggestions([]);
    const searchCityValue = searchCity || city;

    if (!searchCityValue) {
      setError('Please enter a city name.');
      return;
    }

    try {
      const data = await fetchWeather(searchCityValue);
      setWeatherData(data);
      updateRecentSearches(searchCityValue, data);
      updateBackground(data);
    } catch (err) {
      setError('City not found or API error.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecentItemSelect = (selectedCity) => {
    setCity(selectedCity);
    handleSearch(selectedCity);
  };
  

  useEffect(() => {
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, []);

  return (
    <div className={`container ${background}`} style={{ transition: 'background 0.5s ease' }}>
      <div ref={wrapperRef} className="input-wrapper">
        <div className="search-container">
          <div className="input-container">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onKeyUp={handleKeyPress}
              className="search-input"
              placeholder="Enter city name"
            />
            <button onClick={() => handleSearch()} className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>

          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item" onClick={() => handleCitySelect(suggestion)}>
                  {suggestion.name}, {suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


      {error && <p className="error-message">{error}</p>}

      {weatherData && <CurrentWeather weatherData={weatherData} />}

      <RecentSearches recentSearches={recentSearches} handleSelect={handleRecentItemSelect} />
    </div>
  );
};

export default App;
