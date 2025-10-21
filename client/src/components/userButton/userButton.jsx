import "./userButton.css";
import { useState, useEffect, useRef } from "react";
import Image from "../image/image";
import apiRequest from "../../utils/apiRequest";
import { useNavigate, useLocation } from "react-router";
import useAuthStore from "../../utils/authStore";
import { Link } from "react-router";

const UserButton = () => {
  const [open, setOpen] = useState(false);
  const { currentUser, removeCurrentUser } = useAuthStore();
  const userButtonContainerRef = useRef(null);
  const userOptionsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // 先清除本地状态
      removeCurrentUser();
      
      // 然后调用后端退出API
      await apiRequest.post("/users/auth/logout", {});
      
      // 确保状态完全清除
      localStorage.removeItem('auth-storage');
      
      // 修改为跳转到首页，而不是登录页
      navigate("/");
      setOpen(false);
    } catch (error) {
      console.error("退出登录失败:", error);
      // 即使后端失败，也要清除本地状态
      removeCurrentUser();
      localStorage.removeItem('auth-storage');
      // 错误情况下也跳转到首页
      navigate("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (open && userButtonContainerRef.current && userOptionsRef.current) {
        if (
          !userButtonContainerRef.current.contains(e.target) &&
          !userOptionsRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return currentUser ? (
    <div className="userButton" ref={userButtonContainerRef}>
      <Image path={currentUser.img || "/general/noAvatar.png"} alt="" />
      <Image
        onClick={() => setOpen((prev) => !prev)}
        path="/general/arrow.svg"
        alt=""
        className={`arrow ${open ? 'open' : ''}`}  // 添加open类名来控制旋转
      />
      {open && (
        <div className="userOptions show" ref={userOptionsRef}>
          <Link to={`/profile/${currentUser.username}`} className="userOption">个人简介</Link>
          <div className="userOption">设置</div>
          <div className="userOption" onClick={handleLogout}>
            退出登录
          </div>
        </div>
      )}
    </div>
  ) : (
    <button 
      className="loginLink"
      onClick={() => navigate('/auth', { state: { redirectUrl: location.pathname } })}
    >
      登录 / 注册
    </button>
  );
};

export default UserButton;