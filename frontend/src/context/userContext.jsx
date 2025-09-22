import { useEffect } from "react";
import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage when app initializes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Error parsing user from localStorage", err);
        setUser(null);
      }
    }
  }, []);

  // Function to update user
  const updateUser = (userData) => {
    setUser(userData);
  };

  // Function to clear user data (Ex. on logout)
  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
