import React from 'react';
import Chart from 'chart.js/auto';

export function NetworkGraph({ data, id, labels, title }) {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  React.useEffect(() => {
    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels || ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
          datasets: [{
            label: title || 'Distribution',
            data: data,
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 40
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, title]);

  return (
    <div className="h-64">
      <canvas id={id} ref={chartRef}></canvas>
    </div>
  );
}