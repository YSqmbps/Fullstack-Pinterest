import "./createPage.css";
import IKImage from "../../components/image/image";
import useAuthStore from "../../utils/authStore";
import { useNavigate } from "react-router";
import { useEffect, useState, useRef } from "react";
import Editor from "../../components/editor/editor";
import useEditorStore from "../../utils/editorStore";
import apiRequest from "../../utils/apiRequest";
import { useQuery } from "@tanstack/react-query";
const CreatePage = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();
  const formRef = useRef(null);

  // 新增：获取当前用户的看板列表
  const { data: boards = [] } = useQuery({
    queryKey: ["userBoards", currentUser?._id], // 依赖当前用户ID
    queryFn: () =>
      apiRequest.get(`/boards/${currentUser._id}`).then((res) => res.data),
    enabled: !!currentUser, // 仅当用户登录后才请求
  });

  const [file, setFile] = useState(null);
  const [previewImg, setPreviewImg] = useState({
    url: "",
    width: 0,
    height: 0,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        setPreviewImg({
          url: img.src,
          width: img.width,
          height: img.height,
        });
      };
    }
  }, [file]);

  const { textOptions, canvasOptions } = useEditorStore();

  // 修改 handleSubmit 函数，添加前端验证
  const handleSubmit = async () => {
    if (isEditing) {
      setIsEditing(false);
      return;
    }

    // 前端验证逻辑
    const titleInput = formRef.current?.title;
    const descriptionInput = formRef.current?.description;

    // 检查标题
    if (!titleInput?.value.trim()) {
      alert("请填写标题");
      titleInput?.focus();
      return;
    }

    // 检查描述
    if (!descriptionInput?.value.trim()) {
      alert("请填写描述");
      descriptionInput?.focus();
      return;
    }

    // 检查图片文件
    if (!file) {
      alert("请上传图片文件");
      return;
    }

    // 验证通过，提交表单
    const formData = new FormData(formRef.current);
    formData.append("media", file);
    formData.append("textOptions", JSON.stringify(textOptions));
    formData.append("canvasOptions", JSON.stringify(canvasOptions));

    try {
      const res = await apiRequest.post("/pins", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate(`/pin/${res.data._id}`);
    } catch (error) {
      console.log("发布失败：", error.response?.data?.message || error.message);
    }
  };
  return (
    <div className="createPage">
      <div className="createTop">
        <h1>{isEditing ? "编辑图片" : "创建图片"}</h1>
        <button onClick={handleSubmit}>{isEditing ? "保存" : "发布"}</button>
      </div>

      {isEditing ? (
        <Editor previewImg={previewImg} />
      ) : (
        <div className="createBottom">
          {previewImg.url ? (
            <div className="preview">
              <img src={previewImg.url} alt="" />
              <div className="editIcon" onClick={() => setIsEditing(true)}>
                <IKImage path="/general/edit.svg" alt="" />
              </div>
            </div>
          ) : (
            <>
              <label htmlFor="file" className="upload">
                <div className="uploadTitle">
                  <IKImage path="/general/upload.svg" alt="" />
                  <span>选择一个文件或拖放到这里</span>
                </div>
                <div className="uploadInfo">
                  我们建议少使用高质量的超过20 MB的jpg文件或大于200 MB的.mp4文件
                </div>
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                hidden
              />
            </>
          )}

          <form className="createForm" action="" ref={formRef}>
            <div className="createFormItem">
              <label htmlFor="title">标题</label>
              <input
                type="text"
                placeholder="添加一个标题"
                name="title"
                id="title"
                required
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="description">描述</label>
              <textarea
                rows={6}
                type="text"
                placeholder="添加一个详细的描述"
                name="description"
                id="description"
                required
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="link">链接</label>
              <input
                type="text"
                placeholder="添加一个链接"
                name="link"
                id="link"
              />
            </div>
            <div className="createFormItem">
              <label htmlFor="board">模板</label>
              <select name="board" id="board">
                <option value="">不选择看板（可选）</option>
                {/* 移除所有硬编码选项 */}
              </select>
            </div>
            {/* tags */}
            <div className="createFormItem">
              <label htmlFor="tags">标签</label>
              <input
                type="text"
                placeholder="添加一些标签"
                name="tags"
                id="tags"
              />
              <small>不用担心，大家不会看到这些标签</small>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePage;