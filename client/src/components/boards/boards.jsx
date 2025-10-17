import "./collections.css";
import Image from "../image/image";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { format } from "timeago.js";
import { Link } from "react-router";

const Boards = ({ userId }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["boards", userId],
    queryFn: () => apiRequest.get(`/boards/${userId}`).then((res) => res.data),
  });
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Boards not found</div>;

  console.log(data);

  return (
    <div className="collections">
      {data?.map((board) => (
        <Link to={`/search?boardId=${board._id}`} className="collection" key={board._id}>
          <Image src={board.firstPin?.media || "/pins/pin1.jpeg"} alt="" />
          <div className="collectionInfo">
            <h1>{board.title}</h1>
            <span>
              {board.pinCount} Pins · {format(board.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Boards;
