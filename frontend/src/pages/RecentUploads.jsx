

import { LuArrowRight } from "react-icons/lu";
import moment from 'moment';
import { FolderOpen, Trash2 } from "lucide-react"; // Current Uploads
import { useNavigate } from "react-router-dom";
import UploadInfoCard from "../components/Cards/UploadInfoCard";


export default function RecentUploads({uploads, onSeeMore}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white max-sm:p-4 p-6 rounded-2xl shadow-md shadow-gray-300 border border-gray-200/50">
      <div className="flex items-center justify-between">
        <h5 className="max-sm:text-[16px] text-lg">Recent Uploads</h5>
        {/* <button className="flex items-center gap-3 max-sm:text-[12px] max-sm:px-2  text-[14px] font-medium text-gray-700 bg-gray-50 border border-gray-200/50 rounded-lg px-4 py-1.5 cursor-pointer transition-all duration-300 ease-in-out hover:text-purple-600 hover:bg-purple-100 hover:shadow-md hover:scale-105" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button> */}
      </div>

      <div className="max-sm:mt-4 mt-6">
        {uploads?.slice(0, 5)?.map((item) => (
           <UploadInfoCard
            key={item._id}
            item={item}
            title={item.originalName}
            icon={(item.deleted === true) ? <Trash2 className="max-sm:w-5 max-sm:h-5 w-6 h-6 text-white" /> : <FolderOpen className="max-sm:w-5 max-sm:h-5 w-6 h-6 text-white" />}
            date={moment(item.uploadDate).format("Do MMM YYYY")}
            size={item.size}
            hideDeleteBtn
          /> 
         ))} 
      </div>
    </div>
  );
}
   