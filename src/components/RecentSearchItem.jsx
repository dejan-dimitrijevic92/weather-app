import React from 'react';
import WeatherIcon from './WeatherIcon'
import { roundToNearestHalf } from '../utils/helper';

const RecentSearchItem = ({ search, onClick }) => {
  return (
    <div className="recent-search-item" onClick={onClick}>
      <WeatherIcon icon={search.data.weather[0].icon} description={search.data.weather[0].description} className="recent-weather-icon"/>
      <div className="recent-search-info">
        <p className="recent-city-name">{search.city}</p>
        <p className="recent-temp">{roundToNearestHalf(search.data.main.temp)}°</p>
        <p className="recent-description">{search.data.weather[0].description}</p>
      </div>
    </div>
  );
};

export default RecentSearchItem;
