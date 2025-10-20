import "./comments.css";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import apiRequest from "../../utils/apiRequest.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext.jsx";

const addComment = async (comment) => {
  const res = await apiRequest.post("/comments", comment);
  return res.data;
};

// 评论表单
const CommentForm = ({ pinId }) => {
  // emoji选择器
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleEmojiClick = (emojiObject) => {
    setDesc((prev) => prev + " " + emojiObject.emoji);
    setOpen(false);
  };

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pinId] });
      setDesc("");
      setError("");
      setOpen(false);
    },
    onError: (err) => {
      // 错误提示细化
      if (err.response?.status === 401) {
        setError("请先登录再评论");
      } else if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError("评论失败，请重试");
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 前端预验证
    if (!desc.trim()) {
      setError("评论内容不能为空");
      return;
    }
    if (desc.length > 200) {
      setError("评论不能超过200个字符");
      return;
    }
    mutation.mutate({
      description: desc,
      pin: pinId,
      parentId: null,
    });
  };

  return (
    <form className="commentForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="添加一条评论吧"
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        maxLength={200}
      />
      <div className="emoji">
        <div onClick={() => setOpen(!open)}>😀</div>
        {open && (
          <div className="emojiPicker">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
       <button type="submit" disabled={mutation.isPending || !desc.trim()}>
        发布
      </button>
      {error && <div className="commentError">{error}</div>}
    </form>
  );
};

export default CommentForm;
