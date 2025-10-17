import "./authPage.css";
import { useState } from "react";
import Image from "../../components/image/Image";
const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="authPage">
      <div className="authContainer">
        <Image path="/general/logo.png" />
        <h1>{ isRegister ? "注册" : "登录"}你的 Pinterest 账号</h1>
        {isRegister ? (
         <form key="register">
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
           <form key="login">
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
