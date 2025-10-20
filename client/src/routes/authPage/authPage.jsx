import "./authPage.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import Image from "../../components/image/image";
import apiRequest from "../../utils/apiRequest";
import useAuthStore from "../../utils/authStore";
const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setCurrentUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await apiRequest.post(`/users/auth/${isRegister ? "register" : "login"}`,data);
      navigate("/");

      setCurrentUser(res.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  }



  return (
    <div className="authPage">
      <div className="authContainer">
        <Image path="/general/logo.png" />
        <h1>{ isRegister ? "注册" : "登录"}你的 Pinterest 账号</h1>
        {isRegister ? (
         <form key="register" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="请输入用户名"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="请输入邮箱"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="请输入密码"
              />
            </div>
            <button type="submit">注册</button>
            <p  onClick={() => setIsRegister(false)}>
              已有账号？<b>登录</b>
            </p>
            {error && <p className="error">{error}</p>}
          </form>
        ) : (
           <form key="login" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="请输入邮箱"
              />
            </div>
            <div className="formGroup">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="请输入密码"
              />
            </div>
            <button type="submit">登录</button>
            <p  onClick={() => setIsRegister(true)}>
              还没有账号？<b>注册</b>
            </p>
            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
