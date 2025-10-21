import "./profilePage.css";
import Image from "../../components/image/image";
import { useState } from "react";
import Gallery from "../../components/gallery/gallery";
import Boards from "../../components/boards/boards";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import FollowButton from "./FollowButton";


const ProfilePage = () => {
  const [type, setType] = useState("saved");

  const {username} = useParams();

  const { isPending, error,data } = useQuery({
    queryKey: ["profile", username],
    queryFn: () => apiRequest.get(`/users/${username}`).then(res => res.data),
  })
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>User not found</div>;

  console.log(data);
  


  return (
    <div className="profilePage">
      <Image
        className="profileImg"
        src={data.img || "/general/noAvatar.png"}
        w={100}
        h={100}
        alt=""
      />
      <h1 className="profileName">{data.username}</h1>
      <span className="profileDesc">{data.email}</span>
      <div className="followCounts"> {data.followerCount} 粉丝 · {data.followingCount} 关注 </div>
      <div className="profileInteractions">
        <Image path="/general/share.svg" alt="" />
        <div className="profileButtons">
          <button>留言</button>
          <FollowButton isFollowing={data.isFollowing} username={username} />
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
      {type === "created" ? <Gallery userId={data._id} /> : <Boards userId={data._id} />} 
    </div>
  );
};

export default ProfilePage;
