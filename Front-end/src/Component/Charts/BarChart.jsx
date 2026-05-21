import React, { useMemo } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { fmtCurrency } from "../../utils/helpers";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
);

function BarChart({
  data = [],
  title,
  currentKey,
}) {
  const chartData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),

      datasets: [
        {
          data: data.map((d) => d.value),

          backgroundColor: data.map((d) =>
            "#1A1916"
              
          ),

          borderRadius: 8,
          borderSkipped: false,

          barThickness: 26,

          hoverBackgroundColor: data.map((d) =>
            d.label === currentKey
              ? "#000"
              : "#CFC8BC"
          ),
        },
      ],
    };
  }, [data, currentKey]);

  const options = useMemo(() => {
    return {
      responsive: true,

      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: "#1A1916",

          titleColor: "#fff",
          bodyColor: "#fff",

          padding: 12,

          callbacks: {
            label: (context) =>
              fmtCurrency(context.raw),
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },

          ticks: {
            color: "#9E9A93",
            font: {
              size: 11,
              weight: 500,
            },
          },

          border: {
            display: false,
          },
        },

        y: {
          beginAtZero: true,

          display: false,

          grid: {
            display: false,
            drawBorder: false,
          },

          border: {
            display: false,
          },
        },
      },

      animation: {
        duration: 800,
      },
    };
  }, []);

  return (
    <div className="trend-wrap">
      {title && (
        <div className="trend-title">
          {title}
        </div>
      )}

      <div
        style={{
          height: 220,
          marginTop: 10,
        }}
      >
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
}

export default BarChart;