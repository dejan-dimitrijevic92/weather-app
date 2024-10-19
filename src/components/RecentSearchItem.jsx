import React from 'react';

const RecentSearchItem = ({ search, onClick }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${search.data.weather[0].icon}@2x.png`;

  const roundToNearestHalf = (number) => {
    return Math.round(number * 2) / 2;
  };

  return (
    <div className="recent-search-item" onClick={onClick}>
      <img src={iconUrl} alt={search.data.weather[0].description} className="recent-weather-icon" />
      <div className="recent-search-info">
        <p className="recent-city-name">{search.city}</p>
        <p className="recent-temp">{roundToNearestHalf(search.data.main.temp)}°</p>
        <p className="recent-description">{search.data.weather[0].description}</p>
      </div>
    </div>
  );
};

export default RecentSearchItem;
