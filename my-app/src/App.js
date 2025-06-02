import React, { useEffect, useState } from 'react';
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
    categories: Array.from({ length: 24 }, (_, i) => `${i}:00`), // 0:00 to 23:00
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

function ApexChart() {
  const [currentTemp, setCurrentTemp] = useState(null);
  const [last24hTemps, setLast24hTemps] = useState(Array(24).fill(0));

  useEffect(() => {
    // Example API response: { current: 21.5, last24h: [20.1, 20.3, ..., 21.5] }
    fetch('https://localhost:8080/temperature/last24h')
      .then(res => res.json())
      .then(data => {
        setCurrentTemp(data.current);
        setLast24hTemps(data.last24h);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <h2>Aktuelle Temperatur: {currentTemp !== null ? `${currentTemp}°C` : 'Lädt...'}</h2>
      <ReactApexChart
        options={chartOptions}
        series={[{ name: 'Temperatur', data: last24hTemps }]}
        type="bar"
        height={350}
      />
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Temperatur Übersicht</h1>
      <ApexChart />
    </div>
  );
}

export default App;