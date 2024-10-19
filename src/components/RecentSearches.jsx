import React from 'react';
import RecentSearchItem from './RecentSearchItem';

const RecentSearches = ({ recentSearches, handleSelect }) => {
  return (
    <div className="recent-searches">
      <p className="recent-searches-label">Recent searches</p>
      <div className="recent-searches-grid">
        {recentSearches.length === 0 ? (
          <p>No recent searches.</p>
        ) : (
          recentSearches.slice(0, 3).map((search, index) => (
            <RecentSearchItem key={index} search={search} onClick={() => handleSelect(search.city)} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSearches;
