import "./editor.css";
import Layers from "./Layers";
import Workspace from "./Workspace";
import Options from "./Options";

const Editor = ({ previewImg }) => {
  return (
    <div className="editor">
      <div className="editorTop">
      </div>
        <Layers previewImg={previewImg} />
        <Workspace previewImg={previewImg} />
        <Options previewImg={previewImg} />
    </div>
  );
};

export default Editor;