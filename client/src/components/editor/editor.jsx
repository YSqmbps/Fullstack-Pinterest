import "./editor.css";
import Layers from "./Layers";
import Workspace from "./Workspace";
import Options from "./Options";

const Editor = ({ previewImg }) => {
  return (
    <div className="editor">
      <div className="editorTop">
        <h1>编辑图片</h1>
        <button>保存</button>
      </div>
        <Layers previewImg={previewImg} />
        <Workspace previewImg={previewImg} />
        <Options previewImg={previewImg} />
    </div>
  );
};

export default Editor;