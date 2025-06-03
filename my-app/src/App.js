import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

function App() {
  var chartOptions = {
    chart: { height: 350, type: "bar" },
    xaxis: { categories: [] },
    title: { text: "Temperatur der letzten Tage", align: "center", style: { color: "#444" } }
  };

  var [currentTemp, setCurrentTemp] = useState("");
  var [dailyTemps, setDailyTemps] = useState([]);
  var [loading, setLoading] = useState(false);
  var [searchDate, setSearchDate] = useState("");
  var [forecastTemps, setForecastTemps] = useState([]);
  var [closestTemp, setClosestTemp] = useState(null);

  useEffect(function () {
    async function fetchTemperature() {
      setLoading(true);
      try {
        var response = await fetch("http://localhost:8080/getTemperature");
        var data = await response.json();
        setCurrentTemp(data.temperature);
        setDailyTemps(data.lastDays);
      } catch (error) {
        console.error("Error fetching data:", error);
        setCurrentTemp("Fehler beim Laden");
        setDailyTemps([]);
      }
      setLoading(false);
    }

    fetchTemperature();
  }, []);

  function findClosestTemperature(targetDate) {
    var closestEntry = null;
    var minDiff = Infinity;

    for (var i = 0; i < dailyTemps.length; i++) {
      var entry = dailyTemps[i];
      var dateDiff = Math.abs(new Date(entry.date) - new Date(targetDate));
      if (dateDiff < minDiff) {
        minDiff = dateDiff;
        closestEntry = entry;
      }
    }

    if (closestEntry) {
      setClosestTemp(closestEntry);
      setCurrentTemp(closestEntry.temp);
    }
  }

  function handleTemperatureSearch() {
    findClosestTemperature(searchDate);
    fetchForecast(searchDate);
  }

  async function fetchForecast(date) {
    if (!date) return;
    setLoading(true);
    try {
      var response = await fetch("http://localhost:8080/forecast?startDate=" + date);
      var data = await response.json();
      setForecastTemps(data);
    } catch (error) {
      console.error("Error fetching forecast:", error);
      setForecastTemps([]);
    }
    setLoading(false);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>{loading ? "Lädt..." : currentTemp ? "Temperatur: " + currentTemp + "°C" : "Noch keine Daten"}</h2>

        <input type="date" value={searchDate} onChange={function (e) { setSearchDate(e.target.value); }} />
        <button onClick={handleTemperatureSearch}>Suche Temperatur und Vorhersage</button>

        {closestTemp && (
          <p>
            {searchDate === closestTemp.date
              ? "Temperatur am " + closestTemp.date + ": " + closestTemp.temp + "°C"
              : "Keine exakte Übereinstimmung. Nächste Temperatur: " + closestTemp.temp + "°C am " + closestTemp.date}
          </p>
        )}

        <ReactApexChart options={{ ...chartOptions, xaxis: { categories: dailyTemps.map(function (entry) { return entry.date; }) } }} 
                        series={[{ name: "Temperatur", data: dailyTemps.map(function (entry) { return entry.temp; }) }]} 
                        type="bar" height={350} />
      </header>
    </div>
  );
}

export default App;
