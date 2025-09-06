import { useContext, useEffect } from "react";
import { UserContext } from "../Context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    // console.log(user);
    if (user) return;

    // If user is not present
    let isMounted = true;

    const fetchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user info : ", error);
        if (isMounted) {
          clearUser();
          navigate("/");
        }
      }
    };

    fetchUserInfo();
    // Clean up function
    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);
};
