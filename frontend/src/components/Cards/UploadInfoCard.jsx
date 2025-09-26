import { useEffect, useState } from "react";
import { LuTrash2 } from "react-icons/lu";
 
export default function UploadInfoCard({
  size,
  item,
  title,
  icon,
  date,
  hideDeleteBtn,
}) {
  const getAmountStyles = () =>
    item.deleted !== true
      ? "bg-gradient-to-r from-green-400 to-green-500 text-white"
      : "bg-gradient-to-r from-red-400 to-red-500 text-white";

  const [iconSize, setIconSize] = useState(window.innerWidth <= 640 ? 20 : 28);

  useEffect(() => {
    const handleResize = () => {
      setIconSize(window.innerWidth <= 640 ? 20 : 28);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Format File Size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative flex flex-col items-start gap-3 p-5 rounded-2xl bg-white/60 backdrop-blur-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
      
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>

      {/* File Info */}
      <div className="flex flex-col gap-1 w-full">
        <p className="text-base font-semibold text-gray-800 leading-tight">
          {title}
        </p>
        <span className="text-sm text-gray-500">
          {formatFileSize(size)} • {date}
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between w-full mt-2">
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getAmountStyles()}`}
        >
          {item.deleted === true ? "Deleted" : "Uploaded"}
        </div>

        {!hideDeleteBtn && (
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm hover:bg-red-100 hover:scale-110 transition">
            <LuTrash2 size={iconSize} />
          </button>
        )}
      </div>
    </div>
  );
}