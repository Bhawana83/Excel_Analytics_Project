import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Plotly from "plotly.js-dist-min";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  BarChart3,
  Activity,
  Mountain,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Database,
  Eye,
  Settings,
  Layers,
  Zap,
} from "lucide-react";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import useGetUserUploads from "../hooks/useGetUserUploads";
import DashboardLayout from "../components/Layout/DashboardLayout";

// Mock data for demonstration - replace with your actual hooks
// const useGetUserUploads = () => ({
//   uploads: [
//     { _id: "1", originalName: "sales_data.csv" },
//     { _id: "2", originalName: "performance_metrics.xlsx" },
//     { _id: "3", originalName: "market_analysis.json" },
//   ],
//   loading: false,
// });

// Mock API function - replace with your actual API
const fetchParsed = async (uploadId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!uploadId) return { columns: [], rows: [] };
  const res = await axiosInstance.get(API_PATHS.UPLOAD.GET_PARSED(uploadId));
  return res.data || { columns: [], rows: [] };
};

// Return mock data based on uploadId
//   const mockData = {
//     columns: ["Date", "Revenue", "Category", "Region", "Performance"],
//     rows: [
//       { Date: "2024-01", Revenue: 15000, Category: "A", Region: "North", Performance: 85 },
//       { Date: "2024-02", Revenue: 18000, Category: "B", Region: "South", Performance: 92 },
//       { Date: "2024-03", Revenue: 22000, Category: "A", Region: "East", Performance: 78 },
//       { Date: "2024-04", Revenue: 19000, Category: "C", Region: "West", Performance: 88 },
//       { Date: "2024-05", Revenue: 25000, Category: "B", Region: "North", Performance: 95 },
//       { Date: "2024-06", Revenue: 21000, Category: "A", Region: "South", Performance: 82 }
//     ]
//   };
//   return mockData;
// };

const CHART_TYPES = {
  SURFACE: {
    value: "surface",
    label: "Surface Chart",
    icon: Mountain,
    description: "3D surface with smooth interpolation",
    gradient: "from-blue-500 to-purple-600",
  },
  SCATTER3D: {
    value: "scatter3d",
    label: "3D Scatter",
    icon: Activity,
    description: "Interactive point cloud visualization",
    gradient: "from-green-500 to-teal-600",
  },
  BAR_LIKE: {
    value: "bar_like",
    label: "3D Bars",
    icon: BarChart3,
    description: "Volumetric bar representation",
    gradient: "from-orange-500 to-red-600",
  },
};

// Utility functions (keeping your original logic)
const isNumericColumn = (rows, col) =>
  rows.length > 0 &&
  rows.every(
    (r) => r[col] === null || r[col] === undefined || typeof r[col] === "number"
  );

const uniqueValues = (rows, col) =>
  Array.from(new Set(rows.map((r) => r[col])));

const buildSurfaceMatrix = (
  rows,
  xCol,
  zCol,
  yCol,
  aggregator = (arr) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
) => {
  const xVals = uniqueValues(rows, xCol);
  const zVals = uniqueValues(rows, zCol);

  const sortSafe = (arr) =>
    arr.slice().sort((a, b) => (String(a) > String(b) ? 1 : -1));
  const xs = sortSafe(xVals);
  const zs = sortSafe(zVals);

  const zMatrix = xs.map((x) =>
    zs.map((z) => {
      const matches = rows.filter(
        (r) => r[xCol] + "" === x + "" && r[zCol] + "" === z + ""
      );
      const values = matches.map((m) =>
        Number(m[yCol]).toFixed ? Number(m[yCol]) : parseFloat(m[yCol])
      );
      const numericValues = values.filter((v) => !isNaN(v));
      return aggregator(numericValues);
    })
  );

  return { xs, zs, zMatrix };
};

const buildScatterPoints = (rows, xCol, yCol, zCol, options = {}) => {
  const xVals = uniqueValues(rows, xCol);
  const zVals = uniqueValues(rows, zCol);

  // Create index mapping for categorical values
  const xIndex = Object.fromEntries(xVals.map((v, i) => [String(v), i]));
  const zIndex = Object.fromEntries(zVals.map((v, i) => [String(v), i]));

  const xs = [];
  const ys = [];
  const zs = [];
  const texts = [];
  const sizes = [];

  rows.forEach((r, idx) => {
    const rawX = r[xCol];
    const rawY = r[yCol];
    const rawZ = r[zCol];

    // Handle X mapping (categorical to indices, numeric as-is)
    const mappedX = isNaN(Number(rawX))
      ? xIndex[String(rawX)] || 0
      : Number(rawX);

    // Handle Y mapping - this should be the numeric values (like Revenue)
    const mappedY = isNaN(Number(rawY)) ? 0 : Number(rawY);

    // Handle Z mapping (categorical to indices, numeric as-is)
    const mappedZ = isNaN(Number(rawZ))
      ? zIndex[String(rawZ)] || 0
      : Number(rawZ);

    xs.push(mappedX);
    ys.push(mappedY);
    zs.push(mappedZ);

    texts.push(`${xCol}: ${rawX}<br>${yCol}: ${rawY}<br>${zCol}: ${rawZ}`);

    // Dynamic sizing based on Y values
    const baseSize = 8;
    const maxSize = 25;
    const minSize = 4;

    if (mappedY === 0 || isNaN(mappedY)) {
      sizes.push(baseSize);
    } else {
      // Scale size based on Y value magnitude
      const allYValues = rows
        .map((row) => Number(row[yCol]))
        .filter((val) => !isNaN(val));
      const maxY = Math.max(...allYValues);
      const minY = Math.min(...allYValues);
      const range = maxY - minY || 1;

      const normalizedSize =
        ((Math.abs(mappedY) - Math.abs(minY)) / range) * (maxSize - minSize) +
        minSize;
      sizes.push(Math.max(minSize, Math.min(maxSize, normalizedSize)));
    }
  });

  return {
    xs,
    ys,
    zs,
    texts,
    sizes,
    xTickLabels: xVals,
    zTickLabels: zVals,
  };
};

// Custom Plot Component using Plotly directly
const CustomPlot = ({ data, layout, config, plotRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && data && data.length > 0) {
      Plotly.newPlot(containerRef.current, data, layout, config).then((gd) => {
        if (plotRef) {
          plotRef.current = gd;
        }
      });
    }

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, [data, layout, config]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        Plotly.Plots.resize(containerRef.current);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

const Chart3DPage = () => {
  const { uploads: uploadFiles = [], loading: loadingUploads } =
    useGetUserUploads();
  const [selectedUploadId, setSelectedUploadId] = useState("");
  const [parsed, setParsed] = useState({ columns: [], rows: [] });
  const [loadingParsed, setLoadingParsed] = useState(false);

  const [xCol, setXCol] = useState("");
  const [yCol, setYCol] = useState("");
  const [zCol, setZCol] = useState("");
  const [chartType, setChartType] = useState(CHART_TYPES.SURFACE.value);

  const [error, setError] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const plotRef = useRef(null);

  // Your original useEffect logic
  useEffect(() => {
    let mounted = true;
    if (!selectedUploadId) {
      setParsed({ columns: [], rows: [] });
      setXCol("");
      setYCol("");
      setZCol("");
      return;
    }
    setLoadingParsed(true);
    setError(null);
    fetchParsed(selectedUploadId)
      .then((data) => {
        if (!mounted) return;
        setParsed({
          columns:
            data.columns || Object.keys((data.rows && data.rows[0]) || {}),
          rows: data.rows || [],
        });
        const cols =
          data.columns || Object.keys((data.rows && data.rows[0]) || {});
        if (cols.length) {
          const rows = data.rows || [];
          const firstNumeric = cols.find((c) => isNumericColumn(rows, c));
          const firstNonNumeric = cols.find((c) => !isNumericColumn(rows, c));
          setYCol((prev) => prev || firstNumeric || cols[0]);
          setXCol((prev) => prev || firstNonNumeric || cols[0]);
          setZCol(
            (prev) =>
              prev ||
              cols.find(
                (c) =>
                  c !== (firstNumeric || cols[0]) &&
                  c !== (firstNonNumeric || cols[0])
              ) ||
              cols[1] ||
              cols[0]
          );
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch parsed upload data");
      })
      .finally(() => setLoadingParsed(false));
    return () => {
      mounted = false;
    };
  }, [selectedUploadId]);

  // Your original chartProps logic
  const chartData = useMemo(() => {
    const { rows } = parsed;
    if (!xCol || !yCol || !zCol || !rows || rows.length === 0) return null;

    if (chartType === CHART_TYPES.SURFACE.value) {
      // For surface: X=Date, Y=Revenue (height), Z=Category
      // But Plotly surface expects: x=Date, y=Category, z=Revenue matrix
      const { xs, zs, zMatrix } = buildSurfaceMatrix(
        rows,
        xCol, // Date (X axis)
        zCol, // Category (Y axis in surface)
        yCol, // Revenue (Z height values)
        (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
      );
      return {
        data: [
          {
            z: zMatrix,
            x: xs, // Date values
            y: zs, // Category values
            type: "surface",
            colorscale: [
              [0, "rgb(165, 0, 38)"],
              [0.25, "rgb(215, 48, 39)"],
              [0.5, "rgb(244, 109, 67)"],
              [0.75, "rgb(253, 174, 97)"],
              [1, "rgb(254, 224, 144)"],
            ],
            contours: {
              z: {
                show: true,
                usecolormap: true,
                highlightcolor: "limegreen",
                project: { z: true },
              },
            },
            hovertemplate: `<b>%{x}</b><br>%{y}<br>${yCol}: %{z:.2f}<extra></extra>`,
          },
        ],
        xLabel: xCol, // Date
        yLabel: yCol, // Revenue
        zLabel: zCol, // Category
      };
    }

    const pts = buildScatterPoints(rows, xCol, yCol, zCol, { sizeScale: 8 });

    if (chartType === CHART_TYPES.SCATTER3D.value) {
      return {
        data: [
          {
            x: pts.xs,
            y: pts.ys,
            z: pts.zs,
            mode: "markers",
            type: "scatter3d",
            text: pts.texts,
            marker: {
              size: pts.sizes,
              color: pts.ys, // Color by Y values for better visualization
              colorscale: "Viridis",
              showscale: true,
              opacity: 0.8,
              line: { width: 0.5, color: "rgba(68, 68, 68, 0.8)" },
            },
            hovertemplate: `%{text}<extra></extra>`,
          },
        ],
        xLabel: xCol,
        yLabel: yCol,
        zLabel: zCol,
        xTickLabels: pts.xTickLabels,
        zTickLabels: pts.zTickLabels,
      };
    }

    if (chartType === CHART_TYPES.BAR_LIKE.value) {
      return {
        data: [
          {
            x: pts.xs,
            y: pts.ys,
            z: pts.zs,
            mode: "markers",
            type: "scatter3d",
            marker: {
              size: pts.sizes.map((s) => s * 1.5), // Larger markers for bar effect
              color: pts.ys,
              colorscale: "Portland",
              showscale: true,
              opacity: 0.9,
              symbol: "square",
              line: { width: 1, color: "rgba(68, 68, 68, 0.8)" },
            },
            text: pts.texts,
            hovertemplate: `%{text}<extra></extra>`,
          },
        ],
        xLabel: xCol,
        yLabel: yCol,
        zLabel: zCol,
        xTickLabels: pts.xTickLabels,
        zTickLabels: pts.zTickLabels,
      };
    }

    return null;
  }, [parsed, xCol, yCol, zCol, chartType]);

  const plotLayout = useMemo(() => {
    if (!chartData) return {};

    const commonLayout = {
      scene: {
        bgcolor: "rgba(0,0,0,0)",
        camera: { eye: { x: 1.6, y: 1.6, z: 0.8 } },
        xaxis: {
          title: {
            text: chartData.xLabel,
            font: { size: 14, color: "#374151" },
          },
          showgrid: true,
          gridcolor: "rgba(148, 163, 184, 0.3)",
          zeroline: false,
        },
        yaxis: {
          title: {
            text: chartData.yLabel,
            font: { size: 14, color: "#374151" },
          },
          showgrid: true,
          gridcolor: "rgba(148, 163, 184, 0.3)",
          zeroline: false,
        },
        zaxis: {
          title: {
            text: chartData.zLabel,
            font: { size: 14, color: "#374151" },
          },
          showgrid: true,
          gridcolor: "rgba(148, 163, 184, 0.3)",
          zeroline: false,
        },
      },
      margin: { l: 0, r: 0, b: 0, t: 0 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      font: { family: "Inter, sans-serif", color: "#374151" },
      height: Math.min(600, window.innerHeight * 0.6),
      autosize: true,
    };

    if (
      chartType === CHART_TYPES.SCATTER3D.value ||
      chartType === CHART_TYPES.BAR_LIKE.value
    ) {
      return {
        ...commonLayout,
        scene: {
          ...commonLayout.scene,
          xaxis: {
            ...commonLayout.scene.xaxis,
            ...(chartData.xTickLabels && {
              tickvals: chartData.xTickLabels.map((_, i) => i),
              ticktext: chartData.xTickLabels,
            }),
          },
          zaxis: {
            ...commonLayout.scene.zaxis,
            ...(chartData.zTickLabels && {
              tickvals: chartData.zTickLabels.map((_, i) => i),
              ticktext: chartData.zTickLabels,
            }),
          },
        },
      };
    }

    return commonLayout;
  }, [chartData, chartType]);

  const plotConfig = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ["pan2d", "lasso2d"],
    displaylogo: false,
  };

  const renderPlot = () => {
    if (!chartData)
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-96 text-gray-400"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
            <BarChart3 size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ready to Visualize</h3>
          <p className="text-center max-w-md">
            Select a dataset and configure your axes to create stunning 3D
            visualizations
          </p>
        </motion.div>
      );

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <CustomPlot
          data={chartData.data}
          layout={plotLayout}
          config={plotConfig}
          plotRef={plotRef}
        />
      </motion.div>
    );
  };

  return (
    <DashboardLayout activeMenu="3D Charts ">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-16 z-50"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    3D Chart Explorer
                  </h1>
                  <p className="text-sm text-gray-500">
                    Advanced data visualization platform
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsConfigOpen(!isConfigOpen)}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isConfigOpen
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/60 text-gray-600 hover:bg-white/80"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.header>
        <div className="max-w-7xl mx-auto p-6 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Configuration Panel */}
            <AnimatePresence>
              {isConfigOpen && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className="lg:col-span-3 space-y-6"
                >
                  {/* File Selection */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Database className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        Data Source
                      </h3>
                    </div>

                    <select
                      value={selectedUploadId}
                      onChange={(e) => setSelectedUploadId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="">Select Dataset</option>
                      {loadingUploads ? (
                        <option disabled>Loading datasets...</option>
                      ) : (
                        uploadFiles.map((u) => (
                          <option key={u._id} value={u._id}>
                            {u.originalName}
                          </option>
                        ))
                      )}
                    </select>
                  </motion.div>
                  {/* Chart Type Selection */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        Visualization Type
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {Object.values(CHART_TYPES).map((type) => {
                        const Icon = type.icon;
                        return (
                          <motion.button
                            key={type.value}
                            onClick={() => setChartType(type.value)}
                            className={`p-4 rounded-xl text-left transition-all duration-200 ${
                              chartType === type.value
                                ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg`
                                : "bg-white/50 hover:bg-white/70 text-gray-700"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5" />
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div
                                  className={`text-xs ${
                                    chartType === type.value
                                      ? "text-white/80"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {type.description}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                  {/* Axis Configuration */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        Axis Mapping
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          X Axis (Categories)
                        </label>
                        <select
                          value={xCol}
                          onChange={(e) => setXCol(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200"
                        >
                          <option value="">Select X Axis</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Y Axis (Values)
                        </label>
                        <select
                          value={yCol}
                          onChange={(e) => setYCol(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                        >
                          <option value="">Select Y Axis</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c}{" "}
                              {isNumericColumn(parsed.rows, c) ? "📊" : "📝"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Z Axis (Depth)
                        </label>
                        <select
                          value={zCol}
                          onChange={(e) => setZCol(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200"
                        >
                          <option value="">Select Z Axis</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <motion.button
                        onClick={() => {
                          // Your validation logic
                          if (!selectedUploadId || !xCol || !yCol || !zCol) {
                            return;
                          }
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-4 h-4 inline mr-2" />
                        Visualize
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          setSelectedUploadId("");
                          setParsed({ columns: [], rows: [] });
                          setXCol("");
                          setYCol("");
                          setZCol("");
                        }}
                        className="px-4 py-3 rounded-xl border border-gray-200 bg-white/50 hover:bg-white/70 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Chart Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`${
                isConfigOpen ? "lg:col-span-9" : "lg:col-span-12"
              } transition-all duration-300`}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
                {/* Chart Header */}
                <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-3 h-3 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-800">
                        {chartType === CHART_TYPES.SURFACE.value &&
                          "Surface Visualization"}
                        {chartType === CHART_TYPES.SCATTER3D.value &&
                          "3D Scatter Plot"}
                        {chartType === CHART_TYPES.BAR_LIKE.value &&
                          "3D Bar Chart"}
                      </h3>
                    </div>

                    {chartData && (
                      <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {parsed.rows.length} data points
                      </div>
                    )}
                  </div>
                </div>
                {/* Chart Content */}
                <div className="p-6 min-h-[500px] flex items-center justify-center">
                  {loadingParsed ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center space-y-4"
                    >
                      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                      <p className="text-gray-500 font-medium">
                        Processing your data...
                      </p>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center text-red-500 bg-red-50 p-8 rounded-xl border border-red-200"
                    >
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">⚠️</span>
                      </div>
                      <h3 className="font-semibold mb-2">Error Loading Data</h3>
                      <p className="text-sm">{error}</p>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full">{renderPlot()}</div>
                  )}
                </div>
              </div>
              {/* Tips and Info */}
              {chartData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">
                        Interactive Controls
                      </h4>
                      <p className="text-sm text-blue-600">
                        🖱️ Drag to rotate • 🔍 Scroll to zoom • 📍 Hover for
                        details • 📱 Fully responsive
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          {/* Stats Panel */}
          {chartData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Data Points</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {parsed.rows.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {parsed.columns.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chart Type</p>
                    <p className="text-lg font-bold text-gray-800">
                      {
                        CHART_TYPES[
                          Object.keys(CHART_TYPES).find(
                            (key) => CHART_TYPES[key].value === chartType
                          )
                        ].label
                      }
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center text-gray-500 text-sm"
          >
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Powered by advanced 3D visualization technology</span>
            </div>
          </motion.footer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chart3DPage;

// import { useEffect, useMemo, useRef, useState } from "react";
// import Plot from "react-plotly.js";
// import toast from "react-hot-toast";
// import { API_PATHS } from "../../utils/apiPaths";
// import DashboardLayout from "../../components/Layouts/DashboardLayout";
// import axiosInstance from "../../utils/axiosInstace";
// import useGetUserUploads from "../../hooks/useGetUserUploads";

// /**
//  * /charts/3d page
//  *
//  * Expects backend endpoint (already created by you):
//  * GET /api/upload/:id/data   -> { columns: [...], rows: [{...}, ...] }
//  *
//  * If you named it differently, adjust API call below.
//  */

// const CHART_TYPES = {
//   SURFACE: "surface",
//   SCATTER3D: "scatter3d",
//   BAR_LIKE: "bar_like", // scatter3d with rectangular "bars"
// };

// const fetchParsed = async (uploadId) => {
//   if (!uploadId) return { columns: [], rows: [] };
//   const res = await axiosInstance.get(API_PATHS.UPLOAD.GET_PARSED(uploadId));
//   return res.data || { columns: [], rows: [] };
// };

// // Helpers -------------------------------------------------------------------
// const isNumericColumn = (rows, col) =>
//   rows.length > 0 &&
//   rows.every(
//     (r) => r[col] === null || r[col] === undefined || typeof r[col] === "number"
//   );

// const uniqueValues = (rows, col) =>
//   Array.from(new Set(rows.map((r) => r[col])));

// // Build matrix for surface: rows = uniqueX, cols = uniqueZ, values = aggregateY
// const buildSurfaceMatrix = (
//   rows,
//   xCol,
//   zCol,
//   yCol,
//   aggregator = (arr) =>
//     arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
// ) => {
//   const xVals = uniqueValues(rows, xCol);
//   const zVals = uniqueValues(rows, zCol);

//   // Keep deterministic order (try natural sort for dates/strings)
//   const sortSafe = (arr) =>
//     arr.slice().sort((a, b) => (String(a) > String(b) ? 1 : -1));
//   const xs = sortSafe(xVals);
//   const zs = sortSafe(zVals);

//   const zMatrix = xs.map((x) =>
//     zs.map((z) => {
//       const matches = rows.filter(
//         (r) => r[xCol] + "" === x + "" && r[zCol] + "" === z + ""
//       );
//       const values = matches.map((m) =>
//         Number(m[yCol]).toFixed ? Number(m[yCol]) : parseFloat(m[yCol])
//       );
//       const numericValues = values.filter((v) => !isNaN(v));
//       return aggregator(numericValues);
//     })
//   );

//   return { xs, zs, zMatrix };
// };

// // Build scatter3d points (for scatter and bar-like)
// const buildScatterPoints = (rows, xCol, yCol, zCol, options = {}) => {
//   // If x/z are categorical, convert to indices but keep labels for ticks
//   const xVals = uniqueValues(rows, xCol);
//   const zVals = uniqueValues(rows, zCol);
//   const xIndex = Object.fromEntries(xVals.map((v, i) => [String(v), i]));
//   const zIndex = Object.fromEntries(zVals.map((v, i) => [String(v), i]));

//   const xs = [];
//   const ys = [];
//   const zs = [];
//   const texts = [];
//   const sizes = [];

//   rows.forEach((r) => {
//     const rawX = r[xCol];
//     const rawY = r[yCol];
//     const rawZ = r[zCol];

//     const mappedX = isNaN(Number(rawX)) ? xIndex[String(rawX)] : Number(rawX);
//     const mappedZ = isNaN(Number(rawZ)) ? zIndex[String(rawZ)] : Number(rawZ);
//     const mappedY = Number(rawY);

//     xs.push(mappedX);
//     ys.push(mappedY);
//     zs.push(mappedZ);
//     texts.push(`${xCol}: ${rawX}<br>${yCol}: ${rawY}<br>${zCol}: ${rawZ}`);
//     sizes.push(
//       Math.max(
//         4,
//         isNaN(mappedY)
//           ? 4
//           : Math.min(20, Math.abs(mappedY) / (options.sizeScale || 10))
//       )
//     );
//   });

//   return {
//     xs,
//     ys,
//     zs,
//     texts,
//     sizes,
//     xTickLabels: xVals,
//     zTickLabels: zVals,
//   };
// };

// const Chart3DPage = () => {
//   // Component -----------------------------------------------------------------

//   const { uploads: uploadFiles = [], loading: loadingUploads } =
//     useGetUserUploads();
//   const [selectedUploadId, setSelectedUploadId] = useState("");
//   const [parsed, setParsed] = useState({ columns: [], rows: [] });
//   const [loadingParsed, setLoadingParsed] = useState(false);

//   // mapping state
//   const [xCol, setXCol] = useState("");
//   const [yCol, setYCol] = useState("");
//   const [zCol, setZCol] = useState("");
//   const [chartType, setChartType] = useState(CHART_TYPES.SURFACE);

//   // error / info
//   const [error, setError] = useState(null);

//   const plotRef = useRef(null);

//   // fetch parsed rows/columns when upload selected
//   useEffect(() => {
//     let mounted = true;
//     if (!selectedUploadId) {
//       setParsed({ columns: [], rows: [] });
//       setXCol("");
//       setYCol("");
//       setZCol("");
//       return;
//     }
//     setLoadingParsed(true);
//     setError(null);
//     fetchParsed(selectedUploadId)
//       .then((data) => {
//         if (!mounted) return;
//         // expect { columns: [...], rows: [...] }
//         setParsed({
//           columns:
//             data.columns || Object.keys((data.rows && data.rows[0]) || {}),
//           rows: data.rows || [],
//         });
//         // smart defaults: choose numeric for y, categorical/date for x/z
//         const cols =
//           data.columns || Object.keys((data.rows && data.rows[0]) || {});
//         if (cols.length) {
//           const rows = data.rows || [];
//           // pick first numeric as Y
//           const firstNumeric = cols.find((c) => isNumericColumn(rows, c));
//           const firstNonNumeric = cols.find((c) => !isNumericColumn(rows, c));
//           setYCol((prev) => prev || firstNumeric || cols[0]);
//           setXCol((prev) => prev || firstNonNumeric || cols[0]);
//           setZCol(
//             (prev) =>
//               prev ||
//               cols.find(
//                 (c) =>
//                   c !== (firstNumeric || cols[0]) &&
//                   c !== (firstNonNumeric || cols[0])
//               ) ||
//               cols[1] ||
//               cols[0]
//           );
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Failed to fetch parsed upload data");
//       })
//       .finally(() => setLoadingParsed(false));
//     return () => {
//       mounted = false;
//     };
//   }, [selectedUploadId]);

//   // derived chart data
//   const chartProps = useMemo(() => {
//     const { rows } = parsed;
//     if (!xCol || !yCol || !zCol || !rows || rows.length === 0) return null;

//     // If chart type is surface we build matrix
//     if (chartType === CHART_TYPES.SURFACE) {
//       const { xs, zs, zMatrix } = buildSurfaceMatrix(
//         rows,
//         xCol,
//         yCol,
//         zCol,
//         (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
//       );
//       return {
//         type: "surface",
//         x: xs,
//         y: zs,
//         z: zMatrix,
//         xLabel: xCol,
//         yLabel: yCol,
//         zLabel: zCol,
//       };
//     }

//     // scatter3d / bar_like: build points
//     const pts = buildScatterPoints(rows, xCol, zCol, yCol, { sizeScale: 8 });

//     if (chartType === CHART_TYPES.SCATTER3D) {
//       return {
//         type: "scatter3d",
//         x: pts.xs,
//         y: pts.ys,
//         z: pts.zs,
//         text: pts.texts,
//         marker: {
//           size: pts.sizes,
//           color: pts.zs,
//           colorscale: "Viridis",
//           showscale: true,
//         },
//         xTickLabels: pts.xTickLabels,
//         yTickLabels: pts.zTickLabels, // 🟢 Depth tick labels
//         zTickLabels: pts.yTickLabels, // 🟢 Height tick labels
//         xLabel: xCol,
//         yLabel: yCol,
//         zLabel: zCol,
//       };
//     }

//     // bar_like: emulate vertical bars by many small stacked markers (simpler approach)
//     if (chartType === CHART_TYPES.BAR_LIKE) {
//       return {
//         type: "bar_like",
//         x: pts.xs,
//         y: pts.ys,
//         z: pts.zs,
//         text: pts.texts,
//         marker: {
//           size: 6,
//           color: pts.ys,
//           colorscale: "Portland",
//           showscale: true,
//         },
//         xTickLabels: pts.xTickLabels,
//         zTickLabels: pts.zTickLabels,
//         xLabel: xCol,
//         yLabel: yCol,
//         zLabel: zCol,
//       };
//     }

//     return null;
//   }, [parsed, xCol, yCol, zCol, chartType]);

//   // Render helpers -----------------------------------------------------------
//   const renderPlot = () => {
//     if (!chartProps)
//       return (
//         <div className="p-10 text-center text-gray-500">
//           Pick an upload and map X/Y/Z to render a 3D chart.
//         </div>
//       );

//     if (chartProps.type === "surface") {
//       return (
//         <Plot
//           data={[
//             {
//               z: chartProps.z,
//               x: chartProps.x,
//               y: chartProps.y,
//               type: "surface",
//               colorscale: "Viridis",
//               hovertemplate: `<b>%{x}</b><br>%{y}<br>${chartProps.zLabel}: %{z:.2f}<extra></extra>`,
//             },
//           ]}
//           layout={{
//             scene: {
//               xaxis: { title: chartProps.xLabel },
//               yaxis: { title: chartProps.yLabel },
//               zaxis: { title: chartProps.zLabel },
//               camera: { eye: { x: 1.6, y: 1.6, z: 0.8 } },
//             },
//             margin: { l: 60, r: 40, b: 60, t: 30 },
//             height: 520,
//             hovermode: "closest",
//           }}
//           config={{ responsive: true, displayModeBar: true }}
//           ref={plotRef}
//         />
//       );
//     }

//     if (chartProps.type === "scatter3d") {
//       return (
//         <Plot
//           data={[
//             {
//               x: chartProps.x,
//               y: chartProps.y,
//               z: chartProps.z,
//               mode: "markers",
//               type: "scatter3d",
//               text: chartProps.text,
//               marker: { ...chartProps.marker, opacity: 0.9 },
//               hovertemplate: `%{text}<extra></extra>`,
//             },
//           ]}
//           layout={{
//             scene: {
//               xaxis: {
//                 title: chartProps.xLabel,
//                 tickvals: chartProps.xTickLabels.map((_, i) => i),
//                 ticktext: chartProps.xTickLabels,
//               },
//               yaxis: { title: chartProps.yLabel },
//               zaxis: {
//                 title: chartProps.zLabel,
//                 tickvals: chartProps.zTickLabels.map((_, i) => i),
//                 ticktext: chartProps.zTickLabels,
//               },
//               camera: { eye: { x: 1.6, y: 1.6, z: 0.8 } },
//             },
//             margin: { l: 60, r: 40, b: 60, t: 30 },
//             height: 520,
//           }}
//           config={{ responsive: true, displayModeBar: true }}
//         />
//       );
//     }

//     // bar_like (simple scatter 'bars')
//     return (
//       <Plot
//         data={[
//           {
//             x: chartProps.x,
//             y: chartProps.y,
//             z: chartProps.z,
//             mode: "markers",
//             type: "scatter3d",
//             marker: { ...chartProps.marker, opacity: 0.9 },
//             text: chartProps.text,
//             hovertemplate: `%{text}<extra></extra>`,
//           },
//         ]}
//         layout={{
//           scene: {
//             xaxis: {
//               title: chartProps.xLabel,
//               tickvals: chartProps.xTickLabels.map((_, i) => i),
//               ticktext: chartProps.xTickLabels,
//             },
//             yaxis: { title: chartProps.yLabel },
//             zaxis: {
//               title: chartProps.zLabel,
//               tickvals: chartProps.zTickLabels.map((_, i) => i),
//               ticktext: chartProps.zTickLabels,
//             },
//             camera: { eye: { x: 1.6, y: 1.6, z: 0.8 } },
//           },
//           margin: { l: 60, r: 40, b: 60, t: 30 },
//           height: 520,
//         }}
//         config={{ responsive: true, displayModeBar: true }}
//       />
//     );
//   };

//   return (
//     <DashboardLayout activeMenu="3D Charts">
//       {/* // UI----------------------------------------------------------------------- */}
//       <div className="p-6 md:p-10">
//         <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">
//           🧭 3D Chart Explorer
//         </h2>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Controls */}
//           <div className="col-span-1 bg-white p-4 rounded-xl shadow border border-gray-200">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Upload File
//             </label>
//             <select
//               value={selectedUploadId}
//               onChange={(e) => setSelectedUploadId(e.target.value)}
//               className="w-full border rounded px-3 py-2 mb-4"
//             >
//               <option value="">-- Select File --</option>
//               {loadingUploads ? (
//                 <option disabled>Loading...</option>
//               ) : (
//                 uploadFiles.map((u) => (
//                   <option key={u._id} value={u._id}>
//                     {u.originalName}
//                   </option>
//                 ))
//               )}
//             </select>

//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               X Axis (category / date)
//             </label>
//             <select
//               className="w-full border rounded px-3 py-2 mb-3"
//               value={xCol}
//               onChange={(e) => setXCol(e.target.value)}
//             >
//               <option value="">-- Select X --</option>
//               {parsed.columns.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>

//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Y Axis (numeric)
//             </label>
//             <select
//               className="w-full border rounded px-3 py-2 mb-3"
//               value={yCol}
//               onChange={(e) => setYCol(e.target.value)}
//             >
//               <option value="">-- Select Y --</option>
//               {parsed.columns.map((c) => (
//                 <option key={c} value={c}>
//                   {c} {isNumericColumn(parsed.rows, c) ? "(numeric)" : ""}
//                 </option>
//               ))}
//             </select>

//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Z Axis (category / group)
//             </label>
//             <select
//               className="w-full border rounded px-3 py-2 mb-4"
//               value={zCol}
//               onChange={(e) => setZCol(e.target.value)}
//             >
//               <option value="">-- Select Z --</option>
//               {parsed.columns.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>

//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Chart Type
//             </label>
//             <select
//               value={chartType}
//               onChange={(e) => setChartType(e.target.value)}
//               className="w-full border rounded px-3 py-2 mb-4"
//             >
//               <option value={CHART_TYPES.SURFACE}>Surface (matrix)</option>
//               <option value={CHART_TYPES.SCATTER3D}>Scatter 3D</option>
//               <option value={CHART_TYPES.BAR_LIKE}>Bar-like (scatter)</option>
//             </select>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => {
//                   // basic validation
//                   if (!selectedUploadId)
//                     return toast.error("Choose a file first");
//                   if (!xCol || !yCol || !zCol)
//                     return toast.error("Map all axes");
//                   // if surface requires numeric Y
//                   if (
//                     chartType === CHART_TYPES.SURFACE &&
//                     !isNumericColumn(parsed.rows, yCol)
//                   ) {
//                     return toast.error("Surface requires numeric Y values");
//                   }
//                   toast.success("Chart updated");
//                 }}
//                 className="flex-1 px-3 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
//               >
//                 Update Chart
//               </button>
//               <button
//                 onClick={() => {
//                   setSelectedUploadId("");
//                   setParsed({ columns: [], rows: [] });
//                   setXCol("");
//                   setYCol("");
//                   setZCol("");
//                 }}
//                 className="px-3 py-2 rounded border border-gray-200 hover:bg-gray-50 transition"
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           {/* Chart area */}
//           <div className="col-span-1 lg:col-span-3 bg-white p-4 rounded-xl shadow border border-gray-200 min-h-[420px]">
//             {loadingParsed ? (
//               <div className="p-12 text-center text-gray-500">
//                 Loading parsed data...
//               </div>
//             ) : error ? (
//               <div className="p-12 text-center text-red-500">{error}</div>
//             ) : (
//               renderPlot()
//             )}
//           </div>
//         </div>

//         <div className="mt-6 text-sm text-gray-500">
//           Tip: rotate chart with mouse drag, zoom with scroll, hover points for
//           details.
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// };

// export default Chart3DPage;
