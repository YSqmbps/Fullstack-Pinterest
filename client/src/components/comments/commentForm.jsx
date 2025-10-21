import "./commentForm.css";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import apiRequest from "../../utils/apiRequest.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router";
import NotificationModal from "../modal/NotificationModal.jsx";

const addComment = async (comment) => {
  const res = await apiRequest.post("/comments", comment);
  return res.data;
};

// 评论表单
const CommentForm = ({ pinId }) => {
  // emoji选择器
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation(); // 获取当前位置信息

  const handleEmojiClick = (emojiObject) => {
    setDesc((prev) => prev + " " + emojiObject.emoji);
    setOpen(false);
  };

  const showErrorModal = (title, message) => {
    setModalContent({ title, message });
    setShowModal(true);
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    // 保存当前路径作为重定向目标
    navigate('/auth', { state: { redirectUrl: location.pathname } });
  };

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", pinId] });
      setDesc("");
      setOpen(false);
    },
    onError: (err) => {
      // 错误提示细化
      if (err.response?.status === 401) {
        showErrorModal("请先登录", "您需要登录后才能评论");
      } else if (err.response?.data?.errors) {
        showErrorModal("评论失败", err.response.data.errors[0].msg);
      } else {
        showErrorModal("评论失败", "操作失败，请重试");
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 前端预验证
    if (!desc.trim()) {
      showErrorModal("评论内容不能为空", "请输入评论内容后再发布");
      return;
    }
    if (desc.length > 200) {
      showErrorModal("评论过长", "评论不能超过200个字符");
      return;
    }
    
    // 如果未登录，直接显示登录提示
    if (!user) {
      showErrorModal("请先登录", "您需要登录后才能评论");
      return;
    }
    
    mutation.mutate({
      description: desc,
      pin: pinId,
      parentId: null,
    });
  };

  return (
    <>
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
              <EmojiPicker 
                onEmojiClick={handleEmojiClick} 
                theme="light" // 添加主题设置
                width={350} // 设置宽度
                height={400} // 设置高度
              />
            </div>
          )}
        </div>
        <button style={{backgroundColor:'#e50829'}} type="submit" disabled={mutation.isPending}>
          发布
        </button>
      </form>
      
      {/* 登录提示弹窗 */}
      <NotificationModal
        isOpen={showModal}
        title={modalContent.title}
        message={modalContent.message}
        primaryButtonText={modalContent.title.includes('登录') ? '去登录' : '确定'}
        secondaryButtonText={modalContent.title.includes('登录') ? '取消' : null}
        onPrimaryClick={modalContent.title.includes('登录') ? handleLoginRedirect : () => setShowModal(false)}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default CommentForm;