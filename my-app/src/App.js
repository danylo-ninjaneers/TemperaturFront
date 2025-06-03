import React, { useState } from "react";

function WeatherFetcher() {
  const [date, setDate] = useState("");
  const [weatherList, setWeatherList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const fetchWeather = async () => {
    const response = await fetch(`http://localhost:8080/${date}`);
    if (response.ok) {
      const data = await response.json();
      setWeatherList(data);
      setNotFound(data.length === 0);
    } else {
      setWeatherList([]);
      setNotFound(true);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="YYYY-MM-DD"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      {notFound && <p>No weather data found for this date.</p>}
      {weatherList.length > 0 && (
        <div>
          {weatherList.map((weather, idx) => (
            <div key={idx}>
              <p>Date: {weather.date}</p>
              <p>Min Temp: {weather.tempMin}</p>
              <p>Max Temp: {weather.tempMax}</p>
              <p>Precipitation: {weather.percipitation}</p>
              <p>Wind: {weather.wind}</p>
              <p>Type: {weather.weatherType}</p>
              <hr />
            </div>
          ))}
        </div>
        

      )}
    </div>
  );
}

export default WeatherFetcher;