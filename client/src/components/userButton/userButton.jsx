import "./userButton.css";
import { useState, useEffect, useRef } from "react";
import Image from "../image/image";
import apiRequest from "../../utils/apiRequest";
import { useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";
import { Link } from "react-router";
const UserButton = () => {
  // 下拉菜单状态
  const [open, setOpen] = useState(false);
  // 临时状态
  const { currentUser, removeCurrentUser } = useAuthStore();
  console.log(currentUser);
  
  
  // 创建引用，用于判断点击是否在下拉菜单或按钮内部
  const userButtonContainerRef = useRef(null); // 改为容器的引用
  const userOptionsRef = useRef(null);
  // 导航钩子
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await apiRequest.post("/users/auth/logout", {});
      if (res.status === 200) {
        removeCurrentUser();
        navigate("/auth");
      }
    } catch (error) {
      console.error("退出登录失败:", error);
    }
  };

  // 添加全局点击事件监听
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 如果菜单是打开的，并且点击目标不在菜单或按钮内部，则关闭菜单
      if (open && userButtonContainerRef.current && userOptionsRef.current) {
        if (
          !userButtonContainerRef.current.contains(e.target) &&
          !userOptionsRef.current.contains(e.target)
        ) {
          setOpen(false);
        }
      }
    };
    // 给文档添加点击事件监听
    document.addEventListener("click", handleClickOutside);
    // 组件卸载时移除事件监听
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return currentUser ? (
    <div className="userButton" ref={userButtonContainerRef}>
      <Image path = {currentUser.img || "/general/noAvatar.png"} alt="" />
      <Image
        onClick={() => setOpen((prev) => !prev)}
        path="/general/arrow.svg"
        alt=""
        className="arrow"
      />
      {/* 下拉菜单 */}
      {open && (
        <div className="userOptions" ref={userOptionsRef}>
          <Link to={`/profile/${currentUser.username}`} className="userOption">个人简介</Link>
          <div className="userOption">设置</div>
          <div className="userOption" onClick={handleLogout}>
            退出登录
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="loginLink">
      登录 / 注册
    </Link>
  );
};

export default UserButton;
