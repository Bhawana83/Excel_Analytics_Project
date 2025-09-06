import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { CustomTooltip } from "./CustomTooltip";
import { CustomLegend } from "./CustomLegend";

const CustomPieChart = ({ data, label, totalFiles, colors }) => {
  return (
    <div className="relative w-full h-[420px] bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg p-6">
      {/* Title above chart */}
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{label}</h3>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={140}
            cornerRadius={10}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={3}
              />
            ))}
          </Pie>

          {/* Tooltip with custom card look */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />

          {/* Legend moved to bottom */}
          <Legend
            content={<CustomLegend />}
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Floating Center Info Box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center justify-center w-28 h-28 bg-white/80 backdrop-blur-md rounded-full shadow-md border border-gray-200">
          <span className="text-2xl font-bold text-gray-800">{totalFiles}</span>
          <span className="text-xs text-gray-500 mt-1">Files</span>
        </div>
      </div>
    </div>
  );
};

export default CustomPieChart;


// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// import { CustomTooltip } from "./CustomTooltip";
// import { CustomLegend } from "./CustomLegend";

// const CustomPieChart = ({ data, label, totalFiles, colors }) => {
//   return (
//     <ResponsiveContainer width="100%" height={380}>
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="value"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={130}
//           innerRadius={100}
//           labelLine={false}
//           label={({ cx, cy }) => (
//             <>
//               <text
//                 x={cx}
//                 y={cy - 20}
//                 textAnchor="middle"
//                 fontSize="18px"
//                 fill="#666"
//               >
//                 {label}
//               </text>
//               <text
//                 x={cx}
//                 y={cy + 15}
//                 textAnchor="middle"
//                 fontSize="24px"
//                 fontWeight="bold"
//                 fill="#333"
//               >
//                 {totalFiles}
//               </text>
//             </>
//           )}
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
//           ))}
//         </Pie>

//         <Tooltip content={<CustomTooltip />} />
//         <Legend content={<CustomLegend />} />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };

// export default CustomPieChart;
