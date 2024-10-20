import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { fetchWeather, fetchCitySuggestions, fetchWeatherByCoordinates } from './api';

jest.mock('./api', () => ({
  fetchWeather: jest.fn(),
  fetchCitySuggestions: jest.fn(),
  fetchWeatherByCoordinates: jest.fn(),
}));

const mockWeatherData = {
  weather: [{ icon: '01d', description: 'clear sky', main: 'Clear' }],
  main: {
    temp: 20.5,
    temp_max: 25,
    temp_min: 15,
  },
  timezone: 0,
  coord: { lat: 40.7128, lon: -74.006 },
  name: 'New York',
  sys: { country: 'US' },
};

const mockSearches = [
  { city: 'New York, US', data: mockWeatherData },
  { city: 'London, GB', data: mockWeatherData },
];

beforeAll(() => {
  global.navigator.geolocation = {
    getCurrentPosition: jest.fn().mockImplementation((success, error) => {
      success({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      });
    }),
  };
});

describe('App Component', () => {
  beforeEach(() => {
    fetchWeather.mockResolvedValue(mockWeatherData);
    fetchCitySuggestions.mockResolvedValue([{ name: 'New York', country: 'US', lat: 40.7128, lon: -74.006 }]);
    fetchWeatherByCoordinates.mockResolvedValue(mockWeatherData);
    localStorage.setItem('recentSearches', JSON.stringify(mockSearches));
  });

  it('renders weather data on initial load', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText('New York')).toBeInTheDocument());
    expect(screen.getByText('20.5°', { selector: '.temperature' })).toBeInTheDocument();
  });

  it('fetches weather data for selected city from suggestions', async () => {
    render(<App />);

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'New York' } });

    await waitFor(() => expect(screen.getByText('New York, US')).toBeInTheDocument());

    const suggestion = screen.getByText('New York, US');
    fireEvent.click(suggestion);

    await waitFor(() => expect(screen.getByText('clear sky', { selector: '.description' })).toBeInTheDocument());

    expect(screen.getByText('20.5°', { selector: '.temperature' })).toBeInTheDocument();
  });

  it('shows an error message when weather data fails to load', async () => {
    fetchWeather.mockRejectedValueOnce(new Error('City not found'));

    render(<App />);

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'Invalid City' } });

    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    await waitFor(() => expect(screen.getByText('City not found or API error.')).toBeInTheDocument());
  });

  it('fetches and displays weather data for recent searches', async () => {
    render(<App />);

    await waitFor(() => expect(screen.getByText('New York, US')).toBeInTheDocument());
    expect(screen.getAllByText('20.5°', { selector: '.recent-temp' })[0]).toBeInTheDocument();
  });

  it('handles missing weather data gracefully', async () => {
    localStorage.setItem('recentSearches', JSON.stringify([]));

    render(<App />);

    await waitFor(() => expect(screen.getByText('No recent searches.')).toBeInTheDocument());
  });
});
