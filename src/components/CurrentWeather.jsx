import React from 'react';
import WeatherIcon from './WeatherIcon'
import { roundToNearestHalf } from '../utils/helper';

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, main, weather } = weatherData;

  return (
    <div className="weather-card">
      <WeatherIcon icon={weather[0].icon} description={weather[0].description} />
      <h2 className="city-name">{name}</h2>
      <p className="temperature">{roundToNearestHalf(main.temp)}°</p>
      <p className="description">{weather[0].description}</p>
      <p className="temp-range">
        <span className="temp-high">H: {roundToNearestHalf(main.temp_max)}°</span>
        <span className="temp-low">L: {roundToNearestHalf(main.temp_min)}°</span>
      </p>
    </div>
  );
};

export default CurrentWeather;
