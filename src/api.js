import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0/direct';

/**
 * Fetch weather data for a specific city.
 * @param {string} city - The name of the city to fetch weather data for.
 * @returns {Promise<Object>} - A promise that resolves to the weather data.
 */
export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error('Error fetching the weather data:', error);
    throw error;
  }
};

/**
 * Fetch weather data based on geographic coordinates.
 * @param {number} lat - Latitude.
 * @param {number} lon - Longitude.
 * @returns {Promise<Object>} - A promise that resolves to the weather data.
 */
export const fetchWeatherByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

/**
 * Fetch city suggestions based on search query.
 * @param {string} query - The city name query.
 * @returns {Promise<Array>} - A promise that resolves to a list of city suggestions.
 */
export const fetchCitySuggestions = async (query) => {
  try {
    const response = await axios.get(`${GEOCODING_URL}?q=${query}&limit=5&appid=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    throw error;
  }
}
