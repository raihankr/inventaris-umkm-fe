import { useState, useEffect } from "react";
import api, { apiGet } from "../lib/api.js";
import { AuthContext } from "@/contexts/AuthContext.js";
import { GET_USER_ME } from "@/constants/api/user.js";
import { supabase } from "../lib/supabase.js";

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
      const response = await apiGet(GET_USER_ME);
      const userInfo = response.data.data;
      const { data: avatar } = userInfo.image
        ? supabase.storage.from("fastock").getPublicUrl(userInfo.image)
        : {};

      if (response.status != 200) {
        // Handle non-2xx responses (e.g., 401 Unauthorized)
        throw new Error("Authentication check failed");
      }

      setUserInfo({
        ...userInfo,
        image: avatar.publicUrl,
      });
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
    // Setup interceptor
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          setIsAuthenticated(false);
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    fetchAuthStatus();
  }, []); // Run once on component mount

  // You might want a way to re-fetch auth status, e.g., after login/logout
  const refetchAuthStatus = () => fetchAuthStatus();

  const contextValue = {
    userInfo,
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    error,
    refetchAuthStatus,
  };

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
