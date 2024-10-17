import React from 'react';

const Weather = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, main, weather } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  return (
    <div className="weather">
      <img src={iconUrl} alt={weather[0].description} className="weather-icon" />
      <h2>{name}</h2>
      <p>{main.temp} °C</p>
      <p>{weather[0].description}</p>
    </div>
  );
};

export default Weather;