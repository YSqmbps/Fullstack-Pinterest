import "./createPage.css";
import IKImage from "../../components/image/image";
import useAuthStore from "../../utils/authStore";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Editor from "../../components/editor/editor";

const CreatePage = () => {
  const { currentUser } = useAuthStore();
  const navigate = useNavigate();

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
    if(file) {
        const img = new Image()
        img.src = URL.createObjectURL(file)
        img.onload = () =>{
            setPreviewImg({
                url: img.src,
                width: img.width,
                height: img.height,
            })
        }
    }
  },[file])



  return (
    <div className="createPage">
      <div className="createTop">
        <h1>{isEditing ? "编辑图片" : "创建图片"}</h1>
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "保存" : "发布"}
        </button>
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

          <form className="createForm" action="">
            <div className="createFormItem">
              <label htmlFor="title">标题</label>
              <input
                type="text"
                placeholder="添加一个标题"
                name="title"
                id="title"
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
                <option>选择一个模板</option>
                <option value="1">模板1</option>
                <option value="2">模板2</option>
                <option value="3">模板3</option>
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
