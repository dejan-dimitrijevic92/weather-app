import React from 'react';

const WeatherIcon = ({ icon, description, className = "weather-icon" }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return <img src={iconUrl} alt={description} className={className} />;
};

export default WeatherIcon;
