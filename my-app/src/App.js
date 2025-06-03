import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

// Beispielhafte Chart-Optionen
const chartOptions = {
  chart: { type: "line", height: 350 },
  xaxis: { categories: [] },
  title: { text: "Tages-Temperaturen" }
};

function toDouble(value) {
  return parseFloat(value, 10) || 0;
}

function WeatherFetcher() {
  const [date, setDate] = useState("");
  const [weatherList, setWeatherList] = useState([]);
  const [notFound, setNotFound] = useState(false);

  // Hilfsfunktion für Chart-Daten
  const getDailyTemps = () => {
    return weatherList.map(entry => {
      const tempMax = toDouble(entry.tempMax);
      const tempMin = toDouble(entry.tempMin);
      const wind = toDouble(entry.wind);
      return {
        date: entry.date,
        tempMax,
        tempMin,
        tempMid: (tempMax + tempMin) / 2,
        wind
      };
    });
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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <button onClick={fetchWeather}>Get Weather</button>
    </div>
      {notFound && <p>No weather data found for this date.</p>}
      {weatherList.length > 0 && (
        <div>
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Date</th>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Min Temp</th>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Max Temp</th>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Precipitation</th>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Wind</th>
          <th style={{ border: "1px solid #ccc", padding: "4px" }}>Type</th>
        </tr>
      </thead>
      <tbody>
        {weatherList.map((weather, idx) => (
          <tr key={idx}>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.date}</td>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.tempMin}</td>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.tempMax}</td>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.percipitation}</td>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.wind}</td>
            <td style={{ border: "1px solid #ccc", padding: "4px" }}>{weather.weatherType}</td>
          </tr>
        ))}
      </tbody>
    </table>
          <ReactApexChart
            options={{
              ...chartOptions,
              xaxis: { categories: dailyTemps.map(entry => entry.date) }
            }}
            series={[
              { name: "TemperaturMax", data: dailyTemps.map(entry => entry.tempMax) },
              { name: "TemperaturMIn", data: dailyTemps.map(entry => entry.tempMin) },
              { name: "TemperaturMittel", data: dailyTemps.map(entry => entry.tempMid) },
              { name: "WindGeschwindigkeit", data: dailyTemps.map(entry => entry.wind),color: "purple" }
            ]}
            type="line"
            height={350}
          />
        </div>
      )}
    </div>
  );
}

export default WeatherFetcher;