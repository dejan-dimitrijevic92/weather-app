import React from 'react';
import { render, screen } from '@testing-library/react';
import CurrentWeather from './CurrentWeather';

const mockWeatherData = {
  name: 'London',
  main: { temp: 18.59 },
  weather: [{ description: 'Clear sky' }],
};

test('renders CurrentWeather component correctly', () => {
  render(<CurrentWeather weatherData={mockWeatherData} />);
  expect(screen.getByText('London')).toBeInTheDocument();
  expect(screen.getByText('18.5°')).toBeInTheDocument();
  expect(screen.getByText('Clear sky')).toBeInTheDocument();
});
