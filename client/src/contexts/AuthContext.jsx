import { createContext, useContext, useState, useEffect } from "react";
import useAuthStore from "../utils/authStore";
// 添加默认值
const AuthContext = createContext({
  user: null,
});

export const AuthProvider = ({ children }) => {
  // 直接从 authStore 获取当前用户（与登录逻辑同步）
  const { currentUser } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};