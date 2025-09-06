// Chart2DPage.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useGetUserUploads from "../hooks/useGetUserUploads";
import useParsedUploadData from "../hooks/useParsedUploadData";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Chart2D from "../components/Charts/Chart2D";

const Chart2DPage = () => {
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");

  const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();
  const { columns, rows, error } = useParsedUploadData(selectedUploadId);

  // For preventing y-axis non-numeric values
  useEffect(() => {
    if (!yAxis || rows.length === 0) return;

    const isNumeric = rows.every((row) => {
      const value = row[yAxis];
      return typeof value === "number" && !isNaN(value);
    });

    if (!isNumeric) {
      toast.error("Y-axis must contain numeric values for chart generation.");
    }
  }, [yAxis, rows]);

  // Prepare data for Chart.js
  const alternateColor = ["#875cf5", "#cfbefb"];
  const backgroundColor = new Array(uploadFiles.length)
    .fill(0)
    .map((_, i) => alternateColor[i % 2]);

  // Chart Data
  const chartData = {
    labels: rows.map((row) => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: rows.map((row) => parseFloat(row[yAxis])),
        backgroundColor,
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
        borderSkipped: false,
      },
    ],
  };

  // Chart Handler
  const handleChartOptions = () => {
    if (chartType === "bar") {
      return barOptions;
    } else if (chartType === "line") {
      return lineOptions;
    } else if (chartType === "pie") {
      return pieOptions;
    } 
    // else {
    //   return scatterOptions;
    // }
  };

  // Base responsive options for all chart types
  const baseResponsiveOptions = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    layout: {
      padding: {
        top: window.innerWidth < 768 ? 20 : 25,
        bottom: window.innerWidth < 768 ? 30 : 40, // Extra space for X-axis
        left: window.innerWidth < 768 ? 20 : 25,
        right: window.innerWidth < 768 ? 20 : 25,
      },
    },
    plugins: {
      legend: { 
        position: "top",
        labels: {
          padding: window.innerWidth < 768 ? 12 : 15,
          font: {
            size: window.innerWidth < 768 ? 11 : 13,
          }
        }
      },
      title: { 
        display: true, 
        text: "2D Chart",
        padding: {
          top: 10,
          bottom: 15
        },
        font: {
          size: window.innerWidth < 768 ? 16 : 18,
          weight: "bold"
        }
      },
      tooltip: {
        displayColors: false,
        backgroundColor: "#ffffff",
        titleColor: "#6b21a8",
        bodyColor: "black",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 14,
          weight: "bold",
        },
        bodyFont: {
          size: window.innerWidth < 768 ? 12 : 14,
          weight: "500",
        },
        padding: window.innerWidth < 768 ? 8 : 10,
        cornerRadius: 8,
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${yAxis}: ${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  // Chart Options
  const barOptions = {
    ...baseResponsiveOptions,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          padding: 5,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          padding: 5,
        },
      },
    },
  };

  const lineOptions = {
     interaction: {
      mode: "index",
      intersect: false,
    },
    ...baseResponsiveOptions,
    plugins: {
      ...baseResponsiveOptions.plugins,
      title: {
        ...baseResponsiveOptions.plugins.title,
        text: "Line Chart",
      },
      tooltip: {
        ...baseResponsiveOptions.plugins.tooltip,
        callbacks: {
          label: (ctx) => `Amount: ${ctx.raw} ₹`,
        },
      },
    },
    scales: {
      x: {
        ticks: { 
          font: { size: window.innerWidth < 768 ? 10 : 12 }, 
          color: "#4b5563",
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          padding: 5,
        },
        grid: { display: false },
      },
      y: {
        ticks: { 
          font: { size: window.innerWidth < 768 ? 10 : 12 }, 
          color: "#4b5563",
          padding: 5,
        },
        grid: { display: false },
      },
    },
  };

  const pieOptions = {
    ...baseResponsiveOptions,
    aspectRatio: window.innerWidth < 768 ? 1 : 2, // Higher ratio = smaller pie
    layout: {
      padding: {
        top: 15,
        bottom: 15,
        left: 15,
        right: 15,
      },
    },
    plugins: {
      ...baseResponsiveOptions.plugins,
      legend: {
        position: "right", // Always on the right
        labels: {
          padding: window.innerWidth < 768 ? 8 : 12,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          boxWidth: window.innerWidth < 768 ? 10 : 12,
          usePointStyle: true, // Circular legend indicators
        }
      },
    },
    elements: {
      arc: {
        borderWidth: window.innerWidth < 768 ? 1 : 2,
      }
    },
  };

  // const scatterOptions = {
  //   ...baseResponsiveOptions,
  //   scales: {
  //     x: {
  //       ticks: {
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //         padding: 5,
  //       },
  //       grid: { display: false },
  //     },
  //     y: {
  //       ticks: {
  //         font: {
  //           size: window.innerWidth < 768 ? 10 : 12,
  //         },
  //         padding: 5,
  //       },
  //       grid: { display: false },
  //     },
  //   },
  // };

  const isYAxisNumeric = rows.every(
    (row) => typeof row[yAxis] === "number" && !isNaN(row[yAxis])
  );

  // Dynamic height calculation based on screen size and chart type
  const getChartHeight = () => {
    const width = window.innerWidth;
    if (chartType === "pie") {
      if (width < 480) return "350px";
      if (width < 768) return "380px";
      if (width < 1024) return "420px";
      return "450px";
    } else {
      if (width < 480) return "380px"; // Extra height for X-axis visibility
      if (width < 768) return "420px";
      if (width < 1024) return "460px";
      return "480px";
    }
  };

  return (
    <DashboardLayout activeMenu="2D Charts">
      <div className="p-4 sm:p-6 md:p-10 mx-auto max-w-screen-xl min-h-screen">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
          📊 2D Chart Generator
        </h2>

        <div className="bg-white shadow-xl border rounded-xl p-4 sm:p-6 md:p-8 space-y-6 min-h-fit flex flex-col">
          {/* Upload File Dropdown */}
          <div className="flex-shrink-0">
            <label className="block font-medium mb-2 text-sm sm:text-base">
              Select Upload File
            </label>
            <select
              value={selectedUploadId}
              onChange={(e) => {
                const fileId = e.target.value;
                setSelectedUploadId(fileId);
                setXAxis("");
                setYAxis("");
              }}
              className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">-- Choose File --</option>
              {loadingUploads ? (
                <option disabled>Loading uploads...</option>
              ) : (
                uploadFiles.map((file) => (
                  <option key={file._id} value={file._id}>
                    {file.originalName}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Axis & Chart Type Selectors */}
          {columns.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-shrink-0">
              {/* X-Axis Selector */}
              <div>
                <label className="block font-medium mb-2 text-sm sm:text-base">
                  X-Axis
                </label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select X --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Y-Axis Selector */}
              <div>
                <label className="block font-medium mb-2 text-sm sm:text-base">
                  Y-Axis
                </label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">-- Select Y --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chart Type Selector */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block font-medium mb-2 text-sm sm:text-base">
                  Chart Type
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="w-full border rounded px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                  {/* <option value="scatter">Scatter</option> */}
                </select>
              </div>
            </div>
          )}

          {/* Chart Area */}
          <div className="flex-1 min-h-0">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {(!uploadFiles || uploadFiles.length === 0) && (
              <p className="text-gray-500 text-sm mb-4">No Uploads Found</p>
            )}

            {/* Swap Axis Button */}
            {xAxis && yAxis && (
              <div className="mb-6 flex-shrink-0">
                <button
                  onClick={() => {
                    const temp = xAxis;
                    setXAxis(yAxis);
                    setYAxis(temp);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 active:scale-95 transition duration-200 text-sm font-medium w-full sm:w-auto"
                >
                  🔁 Swap X and Y Axis
                </button>
              </div>
            )}

            {/* Fully Responsive Chart Container */}
            {xAxis && yAxis && rows.length > 0 && isYAxisNumeric && (
              <div className="w-full flex-1">
                {/* Chart container with proper height and padding */}
                <div 
                  className="relative w-full bg-gray-50 rounded-lg overflow-hidden"
                  style={{ height: getChartHeight() }}
                >
                  <div className="w-full h-full p-4 sm:p-6">
                    {chartType === 'pie' ? (
                      <div className="w-full h-full max-w-3xl mx-auto flex items-center justify-center">
                        <Chart2D
                          chartType={chartType}
                          data={chartData}
                          options={handleChartOptions()}
                        />
                      </div>
                    ) : (
                      <Chart2D
                        chartType={chartType}
                        data={chartData}
                        options={handleChartOptions()}
                      />
                    )}
                  </div>
                </div>
                
                {/* Chart info for mobile */}
                <div className="mt-4 text-xs text-gray-600 text-center sm:hidden flex-shrink-0">
                  Tap and hold on chart elements for more details
                </div>
              </div>
            )}

            {/* No data message */}
            {xAxis && yAxis && rows.length === 0 && (
              <div className="text-center py-12 text-gray-500 flex-1 flex flex-col justify-center">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-lg">No data available for selected axes</p>
              </div>
            )}

            {/* Non-numeric Y-axis warning */}
            {xAxis && yAxis && rows.length > 0 && !isYAxisNumeric && (
              <div className="text-center py-12 text-orange-600 bg-orange-50 rounded-lg flex-1 flex flex-col justify-center">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-lg font-medium">Y-axis must contain numeric values</p>
                <p className="text-sm mt-2">Please select a different column for Y-axis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chart2DPage;


//* Below my previous code
// // Chart2DPage.jsx
// import { useEffect, useState } from "react";
// import useParsedUploadData from "../../hooks/useParsedUploadData";
// import Chart2D from "../../components/Charts/Chart2D"; // using Chart.js version
// import useGetUserUploads from "../../hooks/useGetUserUploads";
// import DashboardLayout from "../../components/Layouts/DashboardLayout";
// import toast from "react-hot-toast";

// const Chart2DPage = () => {
//   const [selectedUploadId, setSelectedUploadId] = useState("");
//   const [xAxis, setXAxis] = useState("");
//   const [yAxis, setYAxis] = useState("");
//   const [chartType, setChartType] = useState("bar");

//   const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();
//   const { columns, rows, error } = useParsedUploadData(selectedUploadId);

//   // For preventing y-axis non-numeric values
//   useEffect(() => {
//     if (!yAxis || rows.length === 0) return;

//     const isNumeric = rows.every((row) => {
//       const value = row[yAxis];
//       return typeof value === "number" && !isNaN(value);
//     });

//     if (!isNumeric) {
//       toast.error("Y-axis must contain numeric values for chart generation.");
//     }
//   }, [yAxis, rows]);

//   // Prepare data for Chart.js
//   const alternateColor = ["#875cf5", "#cfbefb"];
//   const backgroundColor = new Array(uploadFiles.length)
//     .fill(0)
//     .map((_, i) => alternateColor[i % 2]);

//   // Chart Data
//   const chartData = {
//     labels: rows.map((row) => row[xAxis]),
//     datasets: [
//       {
//         label: yAxis,
//         data: rows.map((row) => parseFloat(row[yAxis])),
//         backgroundColor,
//         borderRadius: {
//           topLeft: 10,
//           topRight: 10,
//           bottomLeft: 0,
//           bottomRight: 0,
//         },
//         borderSkipped: false,
//       },
//     ],
//   };

//   // Chart Handler
//   const handleChartOptions = () => {
//     if (chartType === "bar") {
//       return barOptions;
//     } else if (chartType === "line") {
//       return barOptions;
//     } else if (chartType === "pie") {
//       return pieOptions;
//     } else {
//       return scatterOptions;
//     }
//   };

//   // Chart Options
//   const barOptions = {
//     responsive: true,
//     devicePixelRatio: 2, // Forces high-res rendering
//     interaction: {
//       mode: "index", // Hover shows tooltip for index (X value)
//       intersect: false, // Trigger even if not directly on the element
//     },
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "2D Chart" },
//       tooltip: {
//         displayColors: false,
//         backgroundColor: "#ffffff", // White background
//         titleColor: "#6b21a8", // Purple title text
//         bodyColor: "black", // Slate-700
//         borderColor: "#e5e7eb", // Gray-200
//         borderWidth: 1,
//         titleFont: {
//           size: 14,
//           weight: "bold",
//         },
//         bodyFont: {
//           size: 14,
//           weight: "500",
//         },
//         padding: 10,
//         cornerRadius: 8,
//         callbacks: {
//           label: function (context) {
//             // Customize label content
//             const value = context.raw;
//             return `${yAxis}: ${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false, // ❌ disables vertical grid lines
//         },
//       },
//       y: {
//         grid: {
//           display: false, // ❌ disables horizontal grid lines
//         },
//       },
//     },
//   };

//   const lineOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           font: { size: 14, weight: "600" },
//           color: "#1f2937",
//         },
//       },
//       title: {
//         display: true,
//         text: "Line Chart",
//         font: { size: 18, weight: "bold" },
//         color: "#1f2937",
//       },
//       tooltip: {
//         displayColors: false,
//         callbacks: {
//           label: (ctx) => `Amount: ${ctx.raw} ₹`,
//         },
//       },
//     },
//     scales: {
//       x: {
//         ticks: { font: { size: 12 }, color: "#4b5563" },
//         grid: { display: false },
//       },
//       y: {
//         ticks: { font: { size: 12 }, color: "#4b5563" },
//         grid: { display: false },
//       },
//     },
//   };

//   const pieOptions = {
//     responsive: false,
//     maintainAspectRatio: false, // ✅ optiona
//     devicePixelRatio: 2, // Forces high-res rendering
//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "2D Chart" },
//       tooltip: {
//         displayColors: false,
//         backgroundColor: "#ffffff", // White background
//         titleColor: "#6b21a8", // Purple title text
//         bodyColor: "black", // Slate-700
//         borderColor: "#e5e7eb", // Gray-200
//         borderWidth: 1,
//         titleFont: {
//           size: 14,
//           weight: "bold",
//         },
//         bodyFont: {
//           size: 14,
//           weight: "500",
//         },
//         padding: 10,
//         cornerRadius: 8,
//         callbacks: {
//           label: function (context) {
//             // Customize label content
//             const value = context.raw;
//             return `${yAxis}: ${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//   };

//   const scatterOptions = {
//     responsive: true,

//     plugins: {
//       legend: { position: "top" },
//       title: { display: true, text: "2D Chart" },
//       tooltip: {
//         displayColors: false,
//         backgroundColor: "#ffffff", // White background
//         titleColor: "#6b21a8", // Purple title text
//         bodyColor: "black", // Slate-700
//         borderColor: "#e5e7eb", // Gray-200
//         borderWidth: 1,
//         titleFont: {
//           size: 14,
//           weight: "bold",
//         },
//         bodyFont: {
//           size: 14,
//           weight: "500",
//         },
//         padding: 10,
//         cornerRadius: 8,
//         callbacks: {
//           label: function (context) {
//             // Customize label content
//             const value = context.raw;
//             return `${yAxis}: ${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//   };

//   const isYAxisNumeric = rows.every(
//     (row) => typeof row[yAxis] === "number" && !isNaN(row[yAxis])
//   );

//   return (
//     <DashboardLayout activeMenu="2D Charts">
//       <div className="p-4 sm:p-6 md:p-10 mx-auto max-w-screen-xl">
//         <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
//           📊 2D Chart Generator
//         </h2>

//         <div className="bg-white shadow-xl border rounded-xl p-4 sm:p-6 md:p-8 space-y-6">
//           {/* Upload File Dropdown */}
//           <div>
//             <label className="block font-medium mb-2 text-sm sm:text-base">
//               Select Upload File
//             </label>
//             <select
//               value={selectedUploadId}
//               onChange={(e) => {
//                 setSelectedUploadId(e.target.value);
//                 setXAxis("");
//                 setYAxis("");
//               }}
//               className="w-full border rounded px-3 py-2 text-sm sm:text-base"
//             >
//               <option value="">-- Choose File --</option>
//               {loadingUploads ? (
//                 <option disabled>Loading uploads...</option>
//               ) : (
//                 uploadFiles.map((file) => (
//                   <option key={file._id} value={file._id}>
//                     {file.originalName}
//                   </option>
//                 ))
//               )}
//             </select>
//           </div>

//           {/* Axis & Chart Type Selectors */}
//           {columns.length > 0 && (
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//               {/* X-Axis Selector */}
//               <div>
//                 <label className="block font-medium mb-2 text-sm sm:text-base">
//                   X-Axis
//                 </label>
//                 <select
//                   value={xAxis}
//                   onChange={(e) => setXAxis(e.target.value)}
//                   className="w-full border rounded px-3 py-2 text-sm sm:text-base"
//                 >
//                   <option value="">-- Select X --</option>
//                   {columns.map((col) => (
//                     <option key={col} value={col}>
//                       {col}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Y-Axis Selector */}
//               <div>
//                 <label className="block font-medium mb-2 text-sm sm:text-base">
//                   Y-Axis
//                 </label>
//                 <select
//                   value={yAxis}
//                   onChange={(e) => setYAxis(e.target.value)}
//                   className="w-full border rounded px-3 py-2 text-sm sm:text-base"
//                 >
//                   <option value="">-- Select Y --</option>
//                   {columns.map((col) => (
//                     <option key={col} value={col}>
//                       {col}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Chart Type Selector */}
//               <div>
//                 <label className="block font-medium mb-2 text-sm sm:text-base">
//                   Chart Type
//                 </label>
//                 <select
//                   value={chartType}
//                   onChange={(e) => setChartType(e.target.value)}
//                   className="w-full border rounded px-3 py-2 text-sm sm:text-base"
//                 >
//                   <option value="bar">Bar</option>
//                   <option value="line">Line</option>
//                   <option value="pie">Pie</option>
//                   <option value="scatter">Scatter</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Chart Area */}
//           <div className="mt-6">
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//             {(!uploadFiles || uploadFiles.length === 0) && (
//               <p className="text-gray-500 text-sm">No Uploads Found</p>
//             )}

//             {/* Swap Axis Button */}
//             <button
//               onClick={() => {
//                 const temp = xAxis;
//                 setXAxis(yAxis);
//                 setYAxis(temp);
//               }}
//               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 active:scale-95 transition duration-200 text-sm"
//             >
//               🔁 Swap X and Y Axis
//             </button>

//             {/* Responsive Chart Container */}
//             {xAxis && yAxis && rows.length > 0 && isYAxisNumeric && (
//               <div className="w-full max-w-full overflow-x-auto mt-6">
//                 <div className="relative">
//                   <Chart2D
//                     chartType={chartType}
//                     data={chartData}
//                     options={handleChartOptions()}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Chart2DPage;
