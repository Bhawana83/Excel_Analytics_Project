// Creating API for sending data to the backend

export const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

// utils.apiPaths.js
export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/register",
    GET_USER_INFO: "/api/auth/getUser",
    APPROVED_LOGIN: (id) => `/api/auth/approved-login/${id}`,
  },

  SETTINGS: {
    GET_ME: "/api/settings/me",
    UPDATE_PROFILE: "/api/settings/update",
    DELETE_ACCOUNT: "/api/settings/delete",
  },

    ADMIN: {
    STATUS: (id) => `/api/admin/status/${id}`,
    GET_ALL_USERS: "/api/admin/users",
    GET_USER_DETAILS: (id) => `/api/admin/user/${id}`,
    DELETE_USER: (id) => `/api/admin/user/${id}`,
    TOGGLE_BLOCK_USER: (id) => `/api/admin/user/${id}/block`,
    SUMMARY_STATS: "/api/admin/summary",
    CREATE_USER: "/api/admin/user",
    UPDATE_USER: (id) => `/api/admin/user/${id}`,
  },

    ADMIN_FILE: {
    GET_ALL_FILES: "/api/admin/files",
    DOWNLOAD_FILE: (id) => `/api/admin/files/download/${id}`,
    DELETE_FILE: (id) => `/api/admin/files/${id}`,
    // GET_FILE_INSIGHTS: (id) => `/api/admin/file/insights/${id}`,
  },

  SUPER_ADMIN: {
    GET_ALL_USERS: "/api/superadmin/users",
    GET_USER_DETAILS: (id) => `/api/superadmin/user/${id}`,
    GET_ADMIN_DETAILS: (id) => `/api/superadmin/admin/${id}`,
    GET_ALL_ADMINS: "/api/superadmin/admins",
    APPROVED: (id) => `/api/superadmin/approved/${id}`,
    REJECTED: (id) => `/api/superadmin/rejected/${id}`,
     CREATE_USER: "/api/superadmin/user",
    UPDATE_USER: (id) => `/api/superadmin/user/${id}`,
    DELETE_USER: (id) => `/api/superadmin/user/${id}`,
    TOGGLE_BLOCK_USER: (id) => `/api/superadmin/user/${id}/block`,
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

 SUPERADMIN_FILE: {
    GET_ALL_FILES: "/api/superadmin/files",
    DOWNLOAD_FILE: (fileId) => `/api/superadmin/files/download/${fileId}`,
    DELETE_FILE: (id) => `/api/superadmin/files/${id}`,
  },

};
