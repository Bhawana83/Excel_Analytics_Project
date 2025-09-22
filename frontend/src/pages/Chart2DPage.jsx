// Chart2DPage.jsx (Fixed Download with Chart.js Native Export)
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useGetUserUploads from "../hooks/useGetUserUploads";
import useParsedUploadData from "../hooks/useParsedUploadData";
import DashboardLayout from "../components/Layout/DashboardLayout";
import Chart2D from "../components/Charts/Chart2D";
import { Search } from "lucide-react";
import jsPDF from "jspdf";

const Chart2DPage = () => {
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("bar");
  const [searchTerm, setSearchTerm] = useState("");
  const [chartInstance, setChartInstance] = useState(null); // Ref to Chart.js instance

  const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();
  const { columns, rows, error } = useParsedUploadData(selectedUploadId);

  // Auto-select axes when file is selected
  useEffect(() => {
    if (!columns.length || rows.length === 0) return;

    let defaultX = "";
    let defaultY = "";

    // pick first column as X
    defaultX = columns[0];

    // pick first numeric column as Y
    for (let col of columns) {
      const isNumeric = rows.every(
        (row) => typeof row[col] === "number" && !isNaN(row[col])
      );
      if (isNumeric) {
        defaultY = col;
        break;
      }
    }

    if (defaultX && defaultY) {
      setXAxis(defaultX);
      setYAxis(defaultY);
    }
  }, [columns, rows]);

  // Warn if Y-axis is invalid
  useEffect(() => {
    if (!yAxis || rows.length === 0) return;
    const isNumeric = rows.every((row) => {
      const value = row[yAxis];
      return typeof value === "number" && !isNaN(value);
    });
    if (!isNumeric)
      toast.error("Y-axis must contain numeric values for chart generation.");
  }, [yAxis, rows]);

  // Chart colors
  const alternateColor = ["#06b6d4", "#3b82f6"];
  const backgroundColor = new Array(uploadFiles.length)
    .fill(0)
    .map((_, i) => alternateColor[i % 2]);

  const chartData = {
    labels: rows.map((row) => row[xAxis]),
    datasets: [
      {
        label: yAxis,
        data: rows.map((row) => parseFloat(row[yAxis])),
        backgroundColor,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Chart options (make responsive)
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
          },
        },
      },
      title: {
        display: true,
        text: "2D Chart",
        padding: {
          top: 10,
          bottom: 15,
        },
        font: {
          size: window.innerWidth < 768 ? 16 : 18,
          weight: "bold",
        },
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

  const barOptions = {
    ...baseResponsiveOptions,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  const lineOptions = {
    ...baseResponsiveOptions,
    plugins: {
      ...baseResponsiveOptions.plugins,
      title: { ...baseResponsiveOptions.plugins.title, text: "Line Chart" },
    },
  };

  const pieOptions = {
    ...baseResponsiveOptions,
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: window.innerWidth < 768 ? 1 : 2, // smaller pies on mobile
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
      title: { ...baseResponsiveOptions.plugins.title, text: "Pie Chart" },
      legend: {
        position: "right",
        labels: {
          padding: window.innerWidth < 768 ? 8 : 12,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
          boxWidth: window.innerWidth < 768 ? 10 : 12,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label} (${value})`, // Label + value
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.backgroundColor[i],
                  hidden: isNaN(value),
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: window.innerWidth < 768 ? 1 : 2,
      },
    },
  };

  const handleChartOptions = () => {
    if (chartType === "bar") return barOptions;
    if (chartType === "line") return lineOptions;
    if (chartType === "pie") return pieOptions;
  };

  const isYAxisNumeric = rows.every(
    (row) => typeof row[yAxis] === "number" && !isNaN(row[yAxis])
  );

  const getChartHeight = () => {
    if (chartType === "pie") return "400px"; // consistent responsive size
    return "460px";
  };

  // Callback to receive Chart.js instance from Chart2D component
  const handleChartRef = (instance) => {
    setChartInstance(instance);
  };

  // Download chart as PNG (using Chart.js native method)
  const handleDownloadPNG = () => {
    if (!chartInstance) {
      toast.error("Chart not ready for download. Please wait a moment and try again.");
      return;
    }
    try {
      const base64Image = chartInstance.toBase64Image('image/png', 1); // quality 1 for best
      const link = document.createElement("a");
      link.download = `${chartType}_chart_${new Date().toISOString().slice(0,10)}.png`;
      link.href = base64Image;
      link.click();
      toast.success("PNG downloaded successfully!");
    } catch (err) {
      console.error("PNG Download Error:", err);
      toast.error("Failed to download PNG. Check console for details.");
    }
  };

  // Download chart as PDF (using Chart.js image + jsPDF)
  const handleDownloadPDF = () => {
    if (!chartInstance) {
      toast.error("Chart not ready for download. Please wait a moment and try again.");
      return;
    }
    try {
      const base64Image = chartInstance.toBase64Image('image/png', 1);
      const img = new Image();
      img.onload = function () {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [img.width, img.height]
        });
        pdf.addImage(base64Image, 'PNG', 0, 0, img.width, img.height);
        pdf.save(`${chartType}_chart_${new Date().toISOString().slice(0,10)}.pdf`);
        toast.success("PDF downloaded successfully!");
      };
      img.onerror = function () {
        toast.error("Failed to process image for PDF.");
      };
      img.src = base64Image;
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Failed to download PDF. Check console for details.");
    }
  };

  return (
    <DashboardLayout activeMenu="2D Charts">
      <div className="p-6  sm:p-8 md:p-10 mx-auto max-w-screen-xl min-h-screen">
        <h2 className="text-4xl font-extrabold text-center mb-10 text-cyan-700 tracking-tight drop-shadow-sm">
          ⚡ Build Your Chart
        </h2>

        <div className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-2xl rounded-3xl p-8  space-y-8 border border-cyan-100">
          {/* Upload Search Field */}
          <div className="relative">
            <label className="block text-sm font-semibold text-sky-700 mb-2">
              Search Upload File
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border bg-white shadow">
              {loadingUploads ? (
                <p className="p-3 text-gray-500 text-sm">Loading uploads...</p>
              ) : (
                uploadFiles
                  .filter((file) =>
                    file.originalName
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((file) => (
                    <div
                      key={file._id}
                      onClick={() => {
                        setSelectedUploadId(file._id);
                        setXAxis("");
                        setYAxis("");
                      }}
                      className={`px-4 py-2 cursor-pointer text-sm hover:bg-cyan-100 ${
                        selectedUploadId === file._id
                          ? "bg-cyan-50 font-semibold text-cyan-700"
                          : ""
                      }`}
                    >
                      {file.originalName}
                    </div>
                  ))
              )}
              {uploadFiles.length === 0 && (
                <p className="p-3 text-gray-500 text-sm">No uploads found</p>
              )}
            </div>
          </div>

          {/* Step-like Selectors */}
          {columns.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full">
                <label className="text-sm font-medium text-sky-700">
                  X-Axis
                </label>
                <select
                  value={xAxis}
                  onChange={(e) => setXAxis(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">-- Select X --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="text-sm font-medium text-sky-700">
                  Y-Axis
                </label>
                <select
                  value={yAxis}
                  onChange={(e) => setYAxis(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Y --</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label className="text-sm font-medium text-sky-700">
                  Chart Type
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            {(!uploadFiles || uploadFiles.length === 0) && (
              <p className="text-gray-500 text-sm mb-4">No Uploads Found</p>
            )}

            {xAxis && yAxis && (
              <div className="mb-4 text-center">
                <button
                  onClick={() => {
                    const temp = xAxis;
                    setXAxis(yAxis);
                    setYAxis(temp);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow hover:from-sky-600 hover:to-blue-700 transition mr-2"
                >
                  🔁 Swap Axes
                </button>
                <button
                  onClick={handleDownloadPNG}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow hover:from-green-600 hover:to-emerald-700 transition mr-2"
                >
                  📥 Download PNG
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow hover:from-purple-600 hover:to-indigo-700 transition"
                >
                  📄 Download PDF
                </button>
              </div>
            )}

            {xAxis && yAxis && rows.length > 0 && isYAxisNumeric && (
              <div
                className="relative w-full rounded-3xl bg-gradient-to-tr from-sky-100 to-blue-100 border border-blue-200 shadow-xl flex items-center justify-center"
                style={{ height: getChartHeight(), minHeight: "320px" }}
              >
                <div className="w-full h-full max-w-full max-h-full p-4 sm:p-6">
                  <Chart2D
                    chartType={chartType}
                    data={chartData}
                    options={handleChartOptions()}
                    onChartRef={handleChartRef} // Pass callback to get instance
                  />
                </div>
              </div>
            )}

            {xAxis && yAxis && rows.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">📉</div>
                <p>No data available for selected axes</p>
              </div>
            )}

            {xAxis && yAxis && rows.length > 0 && !isYAxisNumeric && (
              <div className="text-center py-10 text-orange-600 bg-orange-50 rounded-lg">
                <div className="text-3xl mb-2">⚠️</div>
                <p className="font-medium">
                  Y-axis must contain numeric values
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chart2DPage;

//* Previous code
// // Chart2DPage.jsx (with Auto Axis Selection + Fully Responsive Charts)
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import useGetUserUploads from "../hooks/useGetUserUploads";
// import useParsedUploadData from "../hooks/useParsedUploadData";
// import DashboardLayout from "../components/Layout/DashboardLayout";
// import Chart2D from "../components/Charts/Chart2D";
// import { Search } from "lucide-react";

// const Chart2DPage = () => {
//   const [selectedUploadId, setSelectedUploadId] = useState("");
//   const [xAxis, setXAxis] = useState("");
//   const [yAxis, setYAxis] = useState("");
//   const [chartType, setChartType] = useState("bar");
//   const [searchTerm, setSearchTerm] = useState("");

//   const { uploads: uploadFiles, loading: loadingUploads } = useGetUserUploads();
//   const { columns, rows, error } = useParsedUploadData(selectedUploadId);

//   // Auto-select axes when file is selected
//   useEffect(() => {
//     if (!columns.length || rows.length === 0) return;

//     let defaultX = "";
//     let defaultY = "";

//     // pick first column as X
//     defaultX = columns[0];

//     // pick first numeric column as Y
//     for (let col of columns) {
//       const isNumeric = rows.every(
//         (row) => typeof row[col] === "number" && !isNaN(row[col])
//       );
//       if (isNumeric) {
//         defaultY = col;
//         break;
//       }
//     }

//     if (defaultX && defaultY) {
//       setXAxis(defaultX);
//       setYAxis(defaultY);
//     }
//   }, [columns, rows]);

//   // Warn if Y-axis is invalid
//   useEffect(() => {
//     if (!yAxis || rows.length === 0) return;
//     const isNumeric = rows.every((row) => {
//       const value = row[yAxis];
//       return typeof value === "number" && !isNaN(value);
//     });
//     if (!isNumeric)
//       toast.error("Y-axis must contain numeric values for chart generation.");
//   }, [yAxis, rows]);

//   // Chart colors
//   const alternateColor = ["#06b6d4", "#3b82f6"];
//   const backgroundColor = new Array(uploadFiles.length)
//     .fill(0)
//     .map((_, i) => alternateColor[i % 2]);

//   const chartData = {
//     labels: rows.map((row) => row[xAxis]),
//     datasets: [
//       {
//         label: yAxis,
//         data: rows.map((row) => parseFloat(row[yAxis])),
//         backgroundColor,
//         borderRadius: 8,
//         borderSkipped: false,
//       },
//     ],
//   };

//   // Chart options (make responsive)
//   const baseResponsiveOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     devicePixelRatio: 2,
//     layout: {
//       padding: {
//         top: window.innerWidth < 768 ? 20 : 25,
//         bottom: window.innerWidth < 768 ? 30 : 40, // Extra space for X-axis
//         left: window.innerWidth < 768 ? 20 : 25,
//         right: window.innerWidth < 768 ? 20 : 25,
//       },
//     },
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           padding: window.innerWidth < 768 ? 12 : 15,
//           font: {
//             size: window.innerWidth < 768 ? 11 : 13,
//           },
//         },
//       },
//       title: {
//         display: true,
//         text: "2D Chart",
//         padding: {
//           top: 10,
//           bottom: 15,
//         },
//         font: {
//           size: window.innerWidth < 768 ? 16 : 18,
//           weight: "bold",
//         },
//       },
//       tooltip: {
//         displayColors: false,
//         backgroundColor: "#ffffff",
//         titleColor: "#6b21a8",
//         bodyColor: "black",
//         borderColor: "#e5e7eb",
//         borderWidth: 1,
//         titleFont: {
//           size: window.innerWidth < 768 ? 12 : 14,
//           weight: "bold",
//         },
//         bodyFont: {
//           size: window.innerWidth < 768 ? 12 : 14,
//           weight: "500",
//         },
//         padding: window.innerWidth < 768 ? 8 : 10,
//         cornerRadius: 8,
//         callbacks: {
//           label: function (context) {
//             const value = context.raw;
//             return `${yAxis}: ${value.toLocaleString()}`;
//           },
//         },
//       },
//     },
//   };

//   const barOptions = {
//     ...baseResponsiveOptions,
//     interaction: { mode: "index", intersect: false },
//     scales: {
//       x: { grid: { display: false } },
//       y: { grid: { display: false } },
//     },
//   };

//   const lineOptions = {
//     ...baseResponsiveOptions,
//     plugins: {
//       ...baseResponsiveOptions.plugins,
//       title: { ...baseResponsiveOptions.plugins.title, text: "Line Chart" },
//     },
//   };

//   const pieOptions = {
//     ...baseResponsiveOptions,
//     responsive: true,
//     maintainAspectRatio: true,
//     aspectRatio: window.innerWidth < 768 ? 1 : 2, // smaller pies on mobile
//     layout: {
//       padding: {
//         top: 15,
//         bottom: 15,
//         left: 15,
//         right: 15,
//       },
//     },
//     plugins: {
//       ...baseResponsiveOptions.plugins,
//       title: { ...baseResponsiveOptions.plugins.title, text: "Pie Chart" },
//       legend: {
//         position: "right",
//         labels: {
//           padding: window.innerWidth < 768 ? 8 : 12,
//           font: {
//             size: window.innerWidth < 768 ? 10 : 12,
//           },
//           boxWidth: window.innerWidth < 768 ? 10 : 12,
//           usePointStyle: true,
//           generateLabels: (chart) => {
//             const data = chart.data;
//             if (data.labels.length && data.datasets.length) {
//               return data.labels.map((label, i) => {
//                 const dataset = data.datasets[0];
//                 const value = dataset.data[i];
//                 return {
//                   text: `${label} (${value})`, // Label + value
//                   fillStyle: dataset.backgroundColor[i],
//                   strokeStyle: dataset.backgroundColor[i],
//                   hidden: isNaN(value),
//                   index: i,
//                 };
//               });
//             }
//             return [];
//           },
//         },
//       },
//     },
//     elements: {
//       arc: {
//         borderWidth: window.innerWidth < 768 ? 1 : 2,
//       },
//     },
//   };

//   const handleChartOptions = () => {
//     if (chartType === "bar") return barOptions;
//     if (chartType === "line") return lineOptions;
//     if (chartType === "pie") return pieOptions;
//   };

//   const isYAxisNumeric = rows.every(
//     (row) => typeof row[yAxis] === "number" && !isNaN(row[yAxis])
//   );

//   const getChartHeight = () => {
//     if (chartType === "pie") return "400px"; // consistent responsive size
//     return "460px";
//   };

//   return (
//     <DashboardLayout activeMenu="2D Charts">
//       <div className="p-6  sm:p-8 md:p-10 mx-auto max-w-screen-xl min-h-screen">
//         <h2 className="text-4xl font-extrabold text-center mb-10 text-cyan-700 tracking-tight drop-shadow-sm">
//           ⚡ Build Your Chart
//         </h2>

//         <div className="bg-gradient-to-br from-cyan-50 via-white to-blue-50 shadow-2xl rounded-3xl p-8  space-y-8 border border-cyan-100">
//           {/* Upload Search Field */}
//           <div className="relative">
//             <label className="block text-sm font-semibold text-sky-700 mb-2">
//               Search Upload File
//             </label>
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by filename..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 text-sm border rounded-xl shadow-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none"
//               />
//               <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//             </div>

//             <div className="mt-3 max-h-48 overflow-y-auto rounded-xl border bg-white shadow">
//               {loadingUploads ? (
//                 <p className="p-3 text-gray-500 text-sm">Loading uploads...</p>
//               ) : (
//                 uploadFiles
//                   .filter((file) =>
//                     file.originalName
//                       .toLowerCase()
//                       .includes(searchTerm.toLowerCase())
//                   )
//                   .map((file) => (
//                     <div
//                       key={file._id}
//                       onClick={() => {
//                         setSelectedUploadId(file._id);
//                         setXAxis("");
//                         setYAxis("");
//                       }}
//                       className={`px-4 py-2 cursor-pointer text-sm hover:bg-cyan-100 ${
//                         selectedUploadId === file._id
//                           ? "bg-cyan-50 font-semibold text-cyan-700"
//                           : ""
//                       }`}
//                     >
//                       {file.originalName}
//                     </div>
//                   ))
//               )}
//               {uploadFiles.length === 0 && (
//                 <p className="p-3 text-gray-500 text-sm">No uploads found</p>
//               )}
//             </div>
//           </div>

//           {/* Step-like Selectors */}
//           {columns.length > 0 && (
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//               <div className="w-full">
//                 <label className="text-sm font-medium text-sky-700">
//                   X-Axis
//                 </label>
//                 <select
//                   value={xAxis}
//                   onChange={(e) => setXAxis(e.target.value)}
//                   className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-cyan-500"
//                 >
//                   <option value="">-- Select X --</option>
//                   {columns.map((col) => (
//                     <option key={col} value={col}>
//                       {col}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="w-full">
//                 <label className="text-sm font-medium text-sky-700">
//                   Y-Axis
//                 </label>
//                 <select
//                   value={yAxis}
//                   onChange={(e) => setYAxis(e.target.value)}
//                   className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">-- Select Y --</option>
//                   {columns.map((col) => (
//                     <option key={col} value={col}>
//                       {col}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="w-full">
//                 <label className="text-sm font-medium text-sky-700">
//                   Chart Type
//                 </label>
//                 <select
//                   value={chartType}
//                   onChange={(e) => setChartType(e.target.value)}
//                   className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
//                 >
//                   <option value="bar">Bar</option>
//                   <option value="line">Line</option>
//                   <option value="pie">Pie</option>
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Chart Section */}
//           <div>
//             {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
//             {(!uploadFiles || uploadFiles.length === 0) && (
//               <p className="text-gray-500 text-sm mb-4">No Uploads Found</p>
//             )}

//             {xAxis && yAxis && (
//               <div className="mb-4 text-center">
//                 <button
//                   onClick={() => {
//                     const temp = xAxis;
//                     setXAxis(yAxis);
//                     setYAxis(temp);
//                   }}
//                   className="px-6 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full shadow hover:from-sky-600 hover:to-blue-700 transition"
//                 >
//                   🔁 Swap Axes
//                 </button>
//               </div>
//             )}

//             {xAxis && yAxis && rows.length > 0 && isYAxisNumeric && (
//               <div
//                 className="relative w-full rounded-3xl bg-gradient-to-tr from-sky-100 to-blue-100 border border-blue-200 shadow-xl flex items-center justify-center"
//                 style={{ height: getChartHeight(), minHeight: "320px" }}
//               >
//                 <div className="w-full h-full max-w-full max-h-full p-4 sm:p-6">
//                   <Chart2D
//                     chartType={chartType}
//                     data={chartData}
//                     options={handleChartOptions()}
//                   />
//                 </div>
//               </div>
//             )}

//             {xAxis && yAxis && rows.length === 0 && (
//               <div className="text-center py-12 text-gray-500">
//                 <div className="text-4xl mb-2">📉</div>
//                 <p>No data available for selected axes</p>
//               </div>
//             )}

//             {xAxis && yAxis && rows.length > 0 && !isYAxisNumeric && (
//               <div className="text-center py-10 text-orange-600 bg-orange-50 rounded-lg">
//                 <div className="text-3xl mb-2">⚠️</div>
//                 <p className="font-medium">
//                   Y-axis must contain numeric values
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Chart2DPage;
