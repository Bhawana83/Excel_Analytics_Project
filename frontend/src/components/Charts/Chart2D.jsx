import React, { forwardRef, useEffect } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart2D = forwardRef(({ chartType = "bar", data, options, onChartRef }, ref) => {
  const chartRef = React.useRef();

  useEffect(() => {
    if (chartRef.current && onChartRef) {
      // Delay to ensure chart is fully rendered
      const timer = setTimeout(() => {
        onChartRef(chartRef.current);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [chartRef, onChartRef, chartType, data]);

  switch (chartType) {
    case "line":
      return (
        <div className="w-full h-full">
          <Line ref={chartRef} data={data} options={options} />
        </div>
      );

    case "pie":
      return (
        <div className="w-full h-full flex justify-center items-center">
          <Pie ref={chartRef} data={data} options={options} />
        </div>
      );

    case "scatter":
      return (
        <div className="w-full h-full">
          <Scatter ref={chartRef} data={data} options={options} />
        </div>
      );

    case "bar":
    default:
      return (
        <div className="w-full h-full">
          <Bar ref={chartRef} data={data} options={options} />
        </div>
      );
  }
});

Chart2D.displayName = "Chart2D";

export default Chart2D;

