import { createContext, useContext } from "react";

export const AuthContext = createContext({
  userInfo: null,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  isLoading: true,
  error: null,
  refetchAuthStatus: () => {}, // A function to manually re-fetch auth status
});

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);


