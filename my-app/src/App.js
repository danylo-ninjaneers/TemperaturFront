import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

// Chart options
const chartOptions = {
  chart: { type: "line", height: 350 },
  xaxis: { categories: [] },
  title: { text: "Tages-Temperaturen" }
};

function toDouble(value) {
  return Math.round((parseFloat(value, 10) || 0) * 10) / 10; // Convert to float and round to one decimal place
}

function WeatherFetcher() {
  const [weatherList, setWeatherList] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [lastInfo, setLastInfo] = useState(null);
  const intervalRef = useRef();

  // Helper for chart data
  const getDailyTemps = () => {
    return weatherList.map(entry => {
      const tempMax = toDouble(entry.tempMax);
      const tempMin = toDouble(entry.tempMin);
      const wind = toDouble(entry.wind);
      return {
        date: entry.date || entry.endDate,
        tempMax,
        tempMin,
        tempMid: Math.round(((tempMax + tempMin) / 2) * 10) / 10, // Rounded to one decimal place
        wind
      };
    });
  };

  // Fetch next weather entry
  const fetchNextWeather = async () => {
    try {
      const response = await fetch("http://localhost:8080/weather");
      if (response.ok) {
        const data = await response.json();
        setWeatherList(data);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    }
  };

  // On mount: fetch first entry and start interval
  useEffect(() => {
    fetchNextWeather(); // Initial fetch
    intervalRef.current = setInterval(fetchNextWeather, 10000); // Every 10 seconds
    return () => clearInterval(intervalRef.current);
  }, []);

  const dailyTemps = getDailyTemps();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button
        style={{ marginBottom: "16px" }}
        onClick={() => setLastInfo(weatherList[weatherList.length - 1])}
        disabled={weatherList.length === 0}
      >
        Show Last Info
      </button>
      {lastInfo && (
        <div style={{ margin: "16px 0", border: "1px solid #ccc", padding: "8px" }}>
          <strong>Letzter Eintrag:</strong><br />
          Datum: {lastInfo.date}<br />
          Min Temp: {lastInfo.tempMin}<br />
          Max Temp: {lastInfo.tempMax}<br />
          Wind: {lastInfo.wind}
        </div>
      )}
      {notFound && <p>No weather data found.</p>}
      {weatherList.length > 0 && (
        <div>
          <ReactApexChart
            options={{
              ...chartOptions,
              xaxis: { categories: dailyTemps.map(entry => entry.date) }
            }}
            series={[
              { name: "TemperaturMax", data: dailyTemps.map(entry => entry.tempMax) },
              { name: "TemperaturMin", data: dailyTemps.map(entry => entry.tempMin) },
              { name: "TemperaturMittel", data: dailyTemps.map(entry => entry.tempMid) },
              { name: "WindGeschwindigkeit", data: dailyTemps.map(entry => entry.wind), color: "purple" }
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