import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// Beispielhafte Chart-Optionen
const chartOptions = {
  chart: { type: "bar", height: 350 },
  xaxis: { categories: [] },
  title: { text: "Tages-Temperaturen" }
};

function WeatherFetcher() {
  const [date, setDate] = useState("");
  const [weatherList, setWeatherList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  // Hilfsfunktion für Chart-Daten
  const getDailyTemps = () => {
    return weatherList.map(entry => ({
      date: entry.date,
      temp: entry.tempMax // oder tempMin, je nach gewünschtem Wert
    }));
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(`http://localhost:8080/${date}`);
      if (response.ok) {
        const data = await response.json();
        // Falls das Backend ein Objekt statt Array liefert, passe hier an:
        const arr = Array.isArray(data) ? data : [data];
        setWeatherList(arr);
        setNotFound(arr.length === 0);
      } else {
        setWeatherList([]);
        setNotFound(true);
      }
    } catch (error) {
      setWeatherList([]);
      setNotFound(true);
    }
  };

  const dailyTemps = getDailyTemps();

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
          <ReactApexChart
            options={{
              ...chartOptions,
              xaxis: { categories: dailyTemps.map(entry => entry.date) }
            }}
            series={[
              { name: "Temperatur", data: dailyTemps.map(entry => entry.temp) }
            ]}
            type="bar"
            height={350}
          />
        </div>
      )}
    </div>
  );
}

export default WeatherFetcher;