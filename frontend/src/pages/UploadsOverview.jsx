import CustomPieChart from "../components/Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const UploadsOverview = ({totalUploads, currentUploads, deleteUploads}) => {
  const FilesData = [
      { name: "Total Uploads", value: totalUploads},
      { name: "Current Uploads", value: currentUploads},
      { name: "Delete Uploads", value: deleteUploads},
  ];

  return (
    <div className="bg-white max-sm:p-4 p-6 rounded-2xl shadow-md shadow-gray-300 border border-gray-200/50">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Uploads Overview</h5>
      </div>

      <CustomPieChart
        data={FilesData}
        label="Total Uploads"
        totalFiles={totalUploads}
        colors={COLORS}
      />
    </div>
  );
};

export default UploadsOverview;
