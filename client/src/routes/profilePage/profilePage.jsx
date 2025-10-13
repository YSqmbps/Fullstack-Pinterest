import "./profilePage.css";
import Image from "../../components/image/image";
import { useState } from "react";
import Gallery from "../../components/gallery/gallery";
import Collections from "../../components/collections/collections";


const ProfilePage = () => {
  const [type, setType] = useState("saved");

  return (
    <div className="profilePage">
      <Image
        className="profileImg"
        path="/general/noAvatar.png"
        w={100}
        h={100}
        alt=""
      />
      <h1 className="profileName">用户昵称</h1>
      <span className="profileDesc">用户描述</span>
      <div className="followCounts"> 100 粉丝 · 66 关注 </div>
      <div className="profileInteractions">
        <Image path="/general/share.svg" alt="" />
        <div className="profileButtons">
          <button>留言</button>
          <button>关注</button>
        </div>
        <Image path="/general/more.svg" alt="" />
      </div>
      <div className="profileOptions">
        <span
          className={type === "created" ? "active" : ""}
          onClick={() => setType("created")}
        >
          已创建
        </span>
        <span
          className={type === "saved" ? "active" : ""}
          onClick={() => setType("saved")}
        >
          已保存
        </span>
      </div>
      {type === "created" ? <Gallery /> : <Collections />} 
    </div>
  );
};

export default ProfilePage;
