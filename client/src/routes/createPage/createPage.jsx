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

  const { textOptions, canvasOptions, resetEditor } = useEditorStore();

  // 选择新文件时重置状态
  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (newFile) {
      setFile(newFile);
      resetEditor(); // 重置编辑状态
    }
  };

  // 修改 handleSubmit 函数，添加前端验证
  const handleSubmit = async () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      // 获取表单中的title和description
      const titleInput = formRef.current.elements.title;
      const descriptionInput = formRef.current.elements.description;

      // 前端验证：检查必要字段
      if (!titleInput.value.trim()) {
        alert("请填写标题");
        titleInput.focus();
        return;
      }
      if (!descriptionInput.value.trim()) {
        alert("请填写描述");
        descriptionInput.focus();
        return;
      }
      if (!file) {
        alert("请选择图片文件");
        return;
      }

      // 验证通过后提交
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
        console.log(error);
        // 显示后端返回的具体错误信息（如“缺少必要字段”）
        alert(error.response?.data?.message || "发布失败，请重试");
      }
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
                  推荐上传：jpg/png/webp（≤20MB）、mp4（≤200MB），图片宽高建议≤3000像素{" "}
                </div>
              </label>
              <input type="file" id="file" onChange={handleFileChange} hidden />
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
              <label htmlFor="board">模版</label>
              <select name="board" id="board">
                <option value="">不选择模版（可选）</option>
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
