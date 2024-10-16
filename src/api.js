import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

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
