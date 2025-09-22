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
import { toast } from "react-toastify";
import jsPDF from "jspdf";

// Mock API function - replace with your actual API
const fetchParsed = async (uploadId) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (!uploadId) return { columns: [], rows: [] };
  const res = await axiosInstance.get(API_PATHS.UPLOAD.GET_PARSED(uploadId));
  return res.data || { columns: [], rows: [] };
};

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

// Utility functions (unchanged)
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

    const mappedX = isNaN(Number(rawX))
      ? xIndex[String(rawX)] || 0
      : Number(rawX);

    const mappedY = isNaN(Number(rawY)) ? 0 : Number(rawY);

    const mappedZ = isNaN(Number(rawZ))
      ? zIndex[String(rawZ)] || 0
      : Number(rawZ);

    xs.push(mappedX);
    ys.push(mappedY);
    zs.push(mappedZ);

    texts.push(`${xCol}: ${rawX}<br>${yCol}: ${rawY}<br>${zCol}: ${rawZ}`);

    const baseSize = 8;
    const maxSize = 25;
    const minSize = 4;

    if (mappedY === 0 || isNaN(mappedY)) {
      sizes.push(baseSize);
    } else {
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

// Custom Plot Component with ref forwarding
const CustomPlot = ({ data, layout, config, onPlotlyRef }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && data && data.length > 0) {
      Plotly.newPlot(containerRef.current, data, layout, config).then((gd) => {
        if (onPlotlyRef) {
          // Increased delay for stability
          const timer = setTimeout(() => {
            onPlotlyRef(gd);
          }, 500);
          return () => clearTimeout(timer);
        }
      });
    }

    return () => {
      if (containerRef.current) {
        Plotly.purge(containerRef.current);
      }
    };
  }, [data, layout, config, onPlotlyRef]);

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
  const [plotlyInstance, setPlotlyInstance] = useState(null);

  const [error, setError] = useState(null);
  const [isConfigOpen, setIsConfigOpen] = useState(true);

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

  // Download chart as PNG
  const handleDownloadPNG = async () => {
    if (!plotlyInstance) {
      toast.error("Chart not ready for download. Please wait a moment and try again.");
      return;
    }
    try {
      await Plotly.downloadImage(plotlyInstance, {
        format: "png",
        width: 1200,
        height: 800,
        filename: `${chartType}_3d_chart_${new Date().toISOString().slice(0, 10)}`,
      });
      toast.success("PNG downloaded successfully!");
    } catch (err) {
      console.error("PNG Download Error:", err);
      toast.error("Failed to download PNG. Check console for details.");
    }
  };

  // Download chart as PDF using jsPDF
  const handleDownloadPDF = async () => {
    if (!plotlyInstance) {
      toast.error("Chart not ready for download. Please wait a moment and try again.");
      return;
    }
    try {
      // Use Plotly to generate a PNG image data URL
      const imageData = await Plotly.toImage(plotlyInstance, {
        format: "png",
        width: 1200,
        height: 800,
      });

      const img = new Image();
      img.src = imageData;

      img.onload = () => {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [1200, 800],
        });
        pdf.addImage(imageData, "PNG", 0, 0, 1200, 800);
        pdf.save(`${chartType}_3d_chart_${new Date().toISOString().slice(0, 10)}.pdf`);
        toast.success("PDF downloaded successfully!");
      };

      img.onerror = () => {
        toast.error("Failed to process image for PDF.");
      };
    } catch (err) {
      console.error("PDF Download Error:", err);
      toast.error("Failed to download PDF. Check console for details.");
    }
  };

  const chartData = useMemo(() => {
    const { rows } = parsed;
    if (!xCol || !yCol || !zCol || !rows || rows.length === 0) return null;

    if (chartType === CHART_TYPES.SURFACE.value) {
      const { xs, zs, zMatrix } = buildSurfaceMatrix(
        rows,
        xCol,
        zCol,
        yCol,
        (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)
      );
      return {
        data: [
          {
            z: zMatrix,
            x: xs,
            y: zs,
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
        xLabel: xCol,
        yLabel: yCol,
        zLabel: zCol,
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
              color: pts.ys,
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
              size: pts.sizes.map((s) => s * 1.5),
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
    toImageButtonOptions: {
      format: "png",
      filename: "3d-chart",
      height: 800,
      width: 1200,
      scale: 2,
    },
  };

  const renderPlot = () => {
    if (!chartData)
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-96 text-gray-400"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-gray-700/10 to-gray-800/10 rounded-full flex items-center justify-center mb-6">
            <BarChart3 size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-200">Ready to Visualize</h3>
          <p className="text-center max-w-md text-gray-400">
            Select a dataset and configure your axes to create stunning 3D visualizations
          </p>
        </motion.div>
      );

    const isYNumeric = isNumericColumn(parsed.rows, yCol);
    const isZNumeric = isNumericColumn(parsed.rows, zCol);

    if (!isYNumeric || !isZNumeric) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-96 text-orange-300"
        >
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-center max-w-md font-medium">
            Y and Z axes must contain numeric values for 3D visualization
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <CustomPlot
          data={chartData.data}
          layout={plotLayout}
          config={plotConfig}
          onPlotlyRef={setPlotlyInstance}
        />
      </motion.div>
    );
  };

  return (
    <DashboardLayout activeMenu="3D Charts">
      <div className="min-h-screen bg-gradient-to-b from-cyan-500 to-sky-600 text-gray-100">
        <div className="sticky top-0 z-40 backdrop-blur-md bg-black/40 border-b border-white/6">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-600 to-cyan-700 flex items-center justify-center shadow-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">3D Studio — Explorer</h1>
                <p className="text-xs text-gray-300">Immersive 3D data visualizations</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-300 mr-2">{parsed.columns.length} dims • {parsed.rows.length} rows</div>
              <button
                onClick={() => setIsConfigOpen((s) => !s)}
                className={`p-2 rounded-md transition ${
                  isConfigOpen ? "bg-indigo-600 text-white" : "bg-white/6 text-gray-200"
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
          <div className={`${isConfigOpen ? "lg:w-3/4" : "w-full"} transition-all duration-300`}>
            <div className="bg-gradient-to-br from-black/40 to-slate-900/40 border border-white/6 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-50">
                      {chartType === CHART_TYPES.SURFACE.value && "Surface View"}
                      {chartType === CHART_TYPES.SCATTER3D.value && "Scatter3D"}
                      {chartType === CHART_TYPES.BAR_LIKE.value && "Volumetric Bars"}
                    </div>
                    <div className="text-xs text-gray-400">{parsed.columns.length} fields • {parsed.rows.length} points</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {chartData && (
                    <div className="text-xs text-gray-300 bg-white/6 px-3 py-1 rounded-full">
                      {parsed.rows.length} points
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!selectedUploadId || !xCol || !yCol || !zCol) return;
                    }}
                    className="bg-emerald-500 px-3 py-1 rounded-md text-sm text-white hover:brightness-110 transition"
                  >
                    <Zap className="w-4 h-4 inline mr-2" /> Render
                  </button>
                </div>
              </div>

              <div className="p-6" style={{ minHeight: 520 }}>
                {loadingParsed ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="space-y-3 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full border-4 border-t-indigo-500/60 border-gray-700 animate-spin"></div>
                      <div className="text-sm text-gray-300">Processing dataset...</div>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-6 bg-red-900/40 rounded-lg border border-red-700">
                    <div className="text-sm font-semibold text-red-200">Error Loading Data</div>
                    <div className="text-xs text-red-300 mt-2">{error}</div>
                  </div>
                ) : (
                  <div className="w-full h-[60vh] bg-gradient-to-br from-slate-800/40 to-black/20 rounded-xl p-2">
                    <div className="w-full h-full rounded-lg overflow-hidden">
                      {xCol && yCol && zCol && (
                        <div className="mb-4 text-center space-x-3">
                          <button
                            onClick={() => {
                              const tempY = yCol;
                              setYCol(zCol);
                              setZCol(tempY);
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full shadow hover:from-purple-600 hover:to-pink-700 transition text-sm"
                          >
                            🔄 Swap Y/Z
                          </button>
                          <button
                            onClick={handleDownloadPNG}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow hover:from-green-600 hover:to-emerald-700 transition text-sm"
                          >
                            📥 Download PNG
                          </button>
                          <button
                            onClick={handleDownloadPDF}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full shadow hover:from-purple-600 hover:to-indigo-700 transition text-sm"
                          >
                            📄 Download PDF
                          </button>
                        </div>
                      )}
                      {renderPlot()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {chartData && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/6 border border-white/6">
                  <div className="text-xs text-gray-300">Data Points</div>
                  <div className="text-2xl font-semibold text-white">{parsed.rows.length}</div>
                </div>
                <div className="p-4 rounded-lg bg-white/6 border border-white/6">
                  <div className="text-xs text-gray-300">Dimensions</div>
                  <div className="text-2xl font-semibold text-white">{parsed.columns.length}</div>
                </div>
                <div className="p-4 rounded-lg bg-white/6 border border-white/6">
                  <div className="text-xs text-gray-300">Chart Type</div>
                  <div className="text-lg font-semibold text-white">
                    {
                      CHART_TYPES[
                        Object.keys(CHART_TYPES).find(
                          (key) => CHART_TYPES[key].value === chartType
                        )
                      ].label
                    }
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`${isConfigOpen ? "lg:w-1/4" : "lg:w-0"} transition-all duration-300`}>
            <AnimatePresence>
              {isConfigOpen && (
                <motion.aside
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 60, opacity: 0 }}
                  className="sticky top-28 bg-gradient-to-tr from-black/40 to-slate-900/30 border border-white/6 rounded-2xl p-4 shadow-2xl"
                >
                  <div className="mb-4">
                    <div className="text-xs text-gray-300 mb-2">Dataset</div>
                    <select
                      value={selectedUploadId}
                      onChange={(e) => setSelectedUploadId(e.target.value)}
                      className="w-full border border-white/6 rounded-md px-3 py-2 text-sm "
                    >
                      <option value="" className="text-black">Select dataset</option>
                      {loadingUploads ? (
                        <option disabled>Loading...</option>
                      ) : (
                        uploadFiles.map((u) => (
                          <option key={u._id} value={u._id} className="text-black">
                            {u.originalName}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-300 mb-2">Visualization</div>
                    <div className="grid gap-2">
                      {Object.values(CHART_TYPES).map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.value}
                            onClick={() => setChartType(type.value)}
                            className={`text-left rounded-lg px-3 py-2 text-sm flex items-center gap-3 transition ${
                              chartType === type.value
                                ? "bg-indigo-600/60 text-white"
                                : "bg-white/6 text-gray-200"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-300">{type.description}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-300 mb-2">Axis Mapping</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[11px] text-gray-400 mb-1">X Axis</div>
                        <select
                          value={xCol}
                          onChange={(e) => setXCol(e.target.value)}
                          className="w-full bg-transparent border border-white/6 rounded-md px-3 py-2 text-sm text-gray-100"
                        >
                          <option value="">Select X</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400 mb-1">Y Axis</div>
                        <select
                          value={yCol}
                          onChange={(e) => setYCol(e.target.value)}
                          className="w-full bg-transparent border border-white/6 rounded-md px-3 py-2 text-sm text-gray-100"
                        >
                          <option value="">Select Y</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c} {isNumericColumn(parsed.rows, c) ? "📊" : "📝"}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <div className="text-[11px] text-gray-400 mb-1">Z Axis</div>
                        <select
                          value={zCol}
                          onChange={(e) => setZCol(e.target.value)}
                          className="w-full bg-transparent border border-white/6 rounded-md px-3 py-2 text-sm text-gray-100"
                        >
                          <option value="">Select Z</option>
                          {parsed.columns.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!selectedUploadId || !xCol || !yCol || !zCol) return;
                      }}
                      className="flex-1 bg-emerald-500 text-white px-3 py-2 rounded-md text-sm"
                    >
                      <Zap className="w-4 h-4 inline mr-2" /> Visualize
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUploadId("");
                        setParsed({ columns: [], rows: [] });
                        setXCol("");
                        setYCol("");
                        setZCol("");
                      }}
                      className="px-3 py-2 rounded-md bg-white/6 text-gray-200"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 pb-12">
          <div className="max-w-7xl mx-auto px-6 text-center text-xs text-gray-400">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Advanced 3D visualization engine • Drag/Zoom/Rotate enabled
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chart3DPage;
