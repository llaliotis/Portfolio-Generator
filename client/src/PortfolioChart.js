// src/PortfolioChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';

function PortfolioChart({ data }) {
  const chartData = {
    labels: data.map(item => item.assetClass),
    datasets: [
      {
        data: data.map(item => item.percentage),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }
    ]
  };

  return <Pie data={chartData} />;
}

export default PortfolioChart;
