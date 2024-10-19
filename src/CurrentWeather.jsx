import React from 'react';

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, main, weather } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  const roundToNearestHalf = (number) => {
    return Math.round(number * 2) / 2;
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="weather-card">
      <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
      <h2 className="city-name">{name}</h2>
      <p className="temperature">{roundToNearestHalf(main.temp)}°</p>
      <p className="description">{capitalizeFirstLetter(weather[0].description)}</p>
      <p className="temp-range">
        <span className="temp-high">H: {roundToNearestHalf(main.temp_max)}°</span>
        <span className="temp-low">L: {roundToNearestHalf(main.temp_min)}°</span>
      </p>
    </div>
  );
};

export default CurrentWeather;
