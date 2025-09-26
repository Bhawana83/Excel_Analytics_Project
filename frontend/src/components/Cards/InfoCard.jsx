export default function InfoCard({ icon, label, value, color }) {
  return ( 
    <div className="flex items-center justify-between bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6 max-sm:p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/60 group">
      
      {/* Icon Section */}
      <div
        className={`flex items-center justify-center w-16 h-16 max-sm:w-12 max-sm:h-12 rounded-xl ${color} text-white text-[24px] shadow-md group-hover:scale-105 transition-transform duration-300`}
      >
        {icon}
      </div>

      {/* Text Section */}
      <div className="text-right">
        <h6 className="max-sm:text-[13px] text-gray-600 font-medium tracking-wide mb-1">
          {label}
        </h6>
        <span className="max-sm:text-[17px] text-[20px] font-semibold text-gray-900">
          {value} {value >= 2 ? "Files" : "File"}
        </span>
      </div>
    </div>
  );
}
