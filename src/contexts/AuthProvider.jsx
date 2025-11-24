import { useState, useEffect } from "react";
import { apiGet } from "../lib/api.js";
import { AuthContext } from "@/contexts/AuthContext.js";

// Provider component

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiGet("/users/me");

      if (response.status != 200) {
        // Handle non-2xx responses (e.g., 401 Unauthorized)
        throw new Error("Authentication check failed");
      }

      setUserInfo(response.data.data);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error fetching auth status:", err);
      setUserInfo(null);
      setIsAuthenticated(false);
      setError(err); // Store the error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthStatus();
  }, []); // Run once on component mount

  // You might want a way to re-fetch auth status, e.g., after login/logout
  const refetchAuthStatus = () => fetchAuthStatus();

  const contextValue = {
    userInfo,
    isAuthenticated,
    isLoading,
    error,
    refetchAuthStatus,
  };

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
