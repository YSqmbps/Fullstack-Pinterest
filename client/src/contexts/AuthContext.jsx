import { createContext, useContext } from "react";
import useAuthStore from "../utils/authStore";

const AuthContext = createContext({
  user: null,
});

export const AuthProvider = ({ children }) => {
  const { currentUser, setCurrentUser, removeCurrentUser } = useAuthStore();

  return (
    <AuthContext.Provider value={{ 
      user: currentUser, 
      setUser: setCurrentUser, 
      removeUser: removeCurrentUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};