import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const useParsedUploadData = (uploadId) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uploadId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(API_PATHS.UPLOAD.GET_PARSED(uploadId));
        setColumns(res.data.columns || []);
        setRows(res.data.rows || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load parsed data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uploadId]);

  return { columns, rows, loading, error };
};

export default useParsedUploadData;
