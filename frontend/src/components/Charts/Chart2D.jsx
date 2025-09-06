// Chart2D.jsx
import React from "react";
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

const Chart2D = ({ chartType = "bar", data, options }) => {
  switch (chartType) {
    case "line":
      return <Line data={data} options={options} />;
    case "pie":
      return (
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[400px] md:max-w-[500px] aspect-square">
            <Pie data={data} options={options} />
          </div>
        </div>
      );
    // case "scatter":
    //   return (
    //     <div className="w-full flex justify-center">
    //       <Scatter data={data} options={options} />
    //     </div>
    //   );
    case "bar":
    default:
      return (
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
          <Bar data={data} options={options} />
        </div>
      );
  }
};

export default Chart2D;
