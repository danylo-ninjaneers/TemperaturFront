import React from 'react';
import ReactApexChart from 'react-apexcharts';

function ApexChart() {
  const [state] = React.useState({
    series: [{
      name: 'Durchschnittstemperatur',
      data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2]
    }],
    options: {
      chart: { height: 350, type: 'bar' },
      plotOptions: { bar: { borderRadius: 10, dataLabels: { position: 'top' } } },
      dataLabels: {
        enabled: true,
        formatter: val => val + "°C",
        offsetY: -20,
        style: { fontSize: '12px', colors: ["#304758"] }
      },
      xaxis: {
        categories: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag",],
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
        text: 'Temperatur',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: { color: '#444' }
      }
    }
  });

  React.useEffect(() => {
    // Replace the URL with your API endpoint
    fetch('https://api.example.com/temperatures/week')
      .then(res => res.json())
      .then(data => {
        // Assume data = [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2]
        setSeries([{
          name: 'durchschnit Temperatur',
          data: data
        }]);
      })
      .catch(err => {
        console.error('Failed to fetch temperature data:', err);
      });
  }, []);

  return (
    <div id="chart">
      <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Aktuelle Datum</h1>
      <ApexChart />
    </div>
  );
}

export default App;