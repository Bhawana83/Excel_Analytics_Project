import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";


const useGetUserUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.UPLOAD.GET_HISTORY); // adjust base URL if needed
      const onlyActive = response.data.uploads?.filter((f) => f.deleted !== true) || [];
      setUploads(response.data.uploads || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchUploads();
  }, []);

  return { uploads, loading, error, fetchUploads };
};

export default useGetUserUploads;
