// Creating API for sending data to the backend

export const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

// utils.apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/register",
    GET_USER_INFO: "/api/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/api/dashboard",
  },

  UPLOAD: {
    UPLOAD_FILE: "/api/upload",
    GET_PARSED: (id) => `/api/upload/${id}/data`,
    GET_HISTORY: "/api/upload/history",
    DELETE_FILE: (fileId) => `/api/upload/${fileId}`,
    DOWNLOAD_FILE: (fileId) => `/api/upload/download/${fileId}`,
    GET_INSIGHTS: (fileId) => `/api/upload/insights/${fileId}`,
  },

  // EXPENSE: {
  //   ADD_EXPENSE: "/api/v1/expense/add",
  //   GET_ALL_EXPENSE: "/api/v1/expense/get",
  //   DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
  //   DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexcel`,
  // },
  // IMAGE: {
  //   UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  // },
};
