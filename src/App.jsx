import { useState } from "react";
import PropTypes from "prop-types";
import Error from "./assets/Error.jsx";
import Forecast from "./assets/Forecast.jsx";
import SearchBar from "./assets/SearchBar";
import WeatherDisplay from "./assets/WeatherDisplay.jsx";

import "./App.css";

function App() {
  const [loacation, setLocation] = useState(""); //State to hold the location to search for
  const [weatherData, setWeatherData] = useState(null); //State for weather results
  const [loading, setLoading] = useState(false); //State for loading indicator
  const [error, setError] = useState(null); //State for error messages

  //Access the API key from enviroment variables
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  //This function will be passed down to searchBar
  const handleSearch = async (searchTerm) => {
    console.log("Fetching weather for: ", searchTerm);
    setLocation(searchTerm); //Update the location state
    setWeatherData(null); //Clear previous results
    setLoading(true); //set loading state
    setError(null); //clear previous errors

    //Construct the API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}&units=metric`; // `units=metric` gives temperature in Celsius

    try {
      const response = await fetch(apiUrl);
      const data = await response.json(); //Parse the JSON response

      if (!response.ok) {
        //OpenWeatherMap often returns an error message in the 'message' field
        throw new Error(data.message || `Error: ${response.status}`);
      }

      // --- Success ---
      console.log("API Response Data:", data); //Log data to see structure
      setWeatherData(data); //Update state with fetched data
    } catch (err) {
      // --- Error ---
      console.error("API Fetch Error:", err);
      setError(err.message); //Update error state
      setWeatherData(null); //Ensure weather data is cleared on error
    } finally {
      // --- Always runs after try or catch ---
      setLoading(false); //Reset Loading State
    }
  };
  return (
    <>
      <div className="App">
        <h1>Weather App</h1>
        {/* Pass handleSearch function as the onSearch prop */}
        <SearchBar onSearch={handleSearch} />

        {/* Display Loading Indicator */}
        {loading && <p>Loading...</p>}

        {/* Display Error Message */}
        {error && <p className="error-message">Error: {error}</p>}

        {/* Display Weather Data */}
        {weatherData && !loading && !error && (
          <div className="weather-info">
            <h2>
              Weather in {weatherData.name}, {weatherData.sys?.country}
            </h2>
            {/* Check if properties exist before accessing */}
            {weatherData.main && (
              <p className="temperature">
                {Math.round(weatherData.main.temp)}°C
              </p>
            )}
            {weatherData.weather && weatherData.weather.length > 0 && (
              <div className="weather-description">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                />
                <p>
                  {weatherData.weather[0].main} (
                  {weatherData.weather[0].description})
                </p>
              </div>
            )}
            {weatherData.main && (
              <div className="weather-details">
                <p>Feels like: {Math.round(weatherData.main.feels_like)}°C</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
              </div>
            )}
            {weatherData.wind && <p>Wind: {weatherData.wind.speed} m/s</p>}
          </div>
        )}
        {/* Initial placeholder message */}
        {!weatherData && !loading && !error && !location && (
          <p>Enter a city to get the weather forecast.</p>
        )}
      </div>
    </>
  );
}

export default App;
