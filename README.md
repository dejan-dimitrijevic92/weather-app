# Weather App

A weather application built with React that allows users to search for city weather, view recent searches, and fetch weather data using the OpenWeatherMap API. The app also uses geolocation to fetch the weather for the user's current location and updates the background based on weather conditions.

## Features

- Search for weather data by city name.
- Fetch weather data based on the user's geolocation.
- View recent searches with live weather updates.
- Dynamic background change based on weather conditions.
- Error handling for unavailable data or geolocation access.
- Keyboard navigation for search suggestions.
- Loading indicator when fetching weather data.

## Technologies

- **React**: UI rendering and component structure.
- **OpenWeatherMap API**: Fetches real-time weather data.
- **Lodash**: Used for debouncing the search input.
- **Jest & React Testing Library**: Unit tests for components.
- **Font Awesome**: Icons for the search button.
- **CSS**: Styling for the app layout and components.

## Installation

1. Clone the repository:

```
git clone https://github.com/dejan-dimitrijevic92/weather-app.git
```

2. Navigate to the project directory:
```
cd weather-app
```

3. Install the dependencies:
```
npm install
```

4. Run the development server:
```
npm start
```

The app should now be running on http://localhost:8080.

## Running Tests

To run the unit tests:
```
npm test
```

## API Integration

The app uses the OpenWeatherMap API for fetching weather data. You need an API key to run the app.

1. Get your API key from OpenWeatherMap.

2. Create a .env file in the root of the project and add your API key:
```
REACT_APP_OPENWEATHER_API_KEY=your-api-key-here
```

## Known Issues

- Geolocation: If the user's browser does not support or denies geolocation, a fallback city (New York) is used to display weather data.

## Future Enhancements

- Add support for more weather details such as wind speed, humidity, etc.
- Improve mobile responsiveness.
- Implement caching for better performance on repeated searches.
- Add weather forecast component
