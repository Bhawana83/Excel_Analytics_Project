import CustomPieChart from "../components/Charts/CustomPieChart";

const COLORS = ["#3B82F6", "#06B6D4", "#F87171"]; // blue, cyan, red

const UploadsOverview = ({ totalUploads, currentUploads, deleteUploads }) => {
  const FilesData = [
    { name: "Total Uploads", value: totalUploads },
    { name: "Current Uploads", value: currentUploads },
    { name: "Delete Uploads", value: deleteUploads },
  ];

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-6 max-sm:p-4 
      bg-gradient-to-br from-cyan-300 to-sky-500 text-white shadow-lg"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-14 -left-14 w-40 h-40 bg-white/20 rounded-full blur-3xl opacity-40" />

      <div className="flex items-center justify-between relative z-10">
        <h5 className="text-lg font-semibold">📊 Uploads Overview</h5>
      </div>

      <div className="mt-6 relative z-10 transition hover:scale-[1.02] hover:shadow-xl rounded-xl">
        <CustomPieChart
          data={FilesData}
          label="Total Uploads"
          totalFiles={totalUploads}
          colors={COLORS}
        />
      </div>
    </div>
  );
};

export default UploadsOverview;





// import CustomPieChart from "../components/Charts/CustomPieChart";

// const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

// const UploadsOverview = ({totalUploads, currentUploads, deleteUploads}) => {
//   const FilesData = [
//       { name: "Total Uploads", value: totalUploads},
//       { name: "Current Uploads", value: currentUploads},
//       { name: "Delete Uploads", value: deleteUploads},
//   ];

//   return (
//     <div className="bg-white max-sm:p-4 p-6 rounded-2xl shadow-md shadow-gray-300 border border-gray-200/50">
//       <div className="flex items-center justify-between">
//         <h5 className="text-lg">Uploads Overview</h5>
//       </div>

//       <CustomPieChart
//         data={FilesData}
//         label="Total Uploads"
//         totalFiles={totalUploads}
//         colors={COLORS}
//       />
//     </div>
//   );
// };

// export default UploadsOverview;
