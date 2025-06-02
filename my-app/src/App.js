import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const chartOptions = {
  chart: { height: 350, type: 'bar' },
  plotOptions: { bar: { borderRadius: 10, dataLabels: { position: 'top' } } },
  dataLabels: {
    enabled: true,
    formatter: val => val + "°C",
    offsetY: -20,
    style: { fontSize: '12px', colors: ["#304758"] }
  },
  xaxis: {
    categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    position: 'top',
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
    tooltip: { enabled: true }
  },
  yaxis: {
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { show: false, formatter: val => val + "°C" }
  },
  title: {
    text: 'Temperatur letzte 24 Stunden',
    floating: true,
    offsetY: 330,
    align: 'center',
    style: { color: '#444' }
  }
};

function App() {
  const [currentTemp, setCurrentTemp] = useState('');
  const [last24hTemps, setLast24hTemps] = useState(Array(24).fill(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemperature = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/getTemperature');
        const data = await response.json();
        setCurrentTemp(data.temperature);
        setLast24hTemps(data.last24h);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCurrentTemp('Fehler beim Laden');
        setLast24hTemps(Array(24).fill(0));
      } finally {
        setLoading(false);
      }
    };
    fetchTemperature();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          {loading
            ? 'Lädt...'
            : currentTemp !== null
            ? `Aktuelle Temperatur: ${currentTemp}°C`
            : 'Noch keine Daten'}
        </h2>
        <ReactApexChart
          options={chartOptions}
          series={[{ name: 'Temperatur', data: last24hTemps }]}
          type="bar"
          height={350}
        />
      </header>
    </div>
  );
}

export default App;