import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import apiRequest from "../../utils/apiRequest.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";


// 
const addComment = async (comment) => {
    const res = await apiRequest.post("/comments", comment);
    return res.data;
}

// 评论表单
const CommentForm = ({ pinId }) => {
  // emoji选择器
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");

  const handleEmojiClick = (emojiObject) => {
    setDesc((prev) => prev + " " + emojiObject.emoji);
    setOpen(false);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pinId] });
      setDesc("");
      setOpen(false);
    },
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({
      description: desc,
      pin: pinId,
    })
  };

  return (
    <form className="commentForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="添加一条评论吧"
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
      />
      <div className="emoji">
        <div onClick={() => setOpen(!open)}>😀</div>
        {open && (
          <div className="emojiPicker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
