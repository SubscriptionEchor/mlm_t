import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function CommissionDistributionChart({ data }) {
  const commissionData = {
    labels: ['Direct', 'Difference', 'Level'],
    datasets: [{
      label: 'Commission Amount ($)',
      data: [
        data.reduce((sum, tx) => sum + tx.directCommission, 0),
        data.reduce((sum, tx) => sum + tx.differenceIncome, 0),
        data.reduce((sum, tx) => sum + tx.levelIncentives, 0)
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Commission Distribution by Type',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `$${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="h-[400px] p-4">
      <Bar data={commissionData} options={options} />
    </div>
  );
}