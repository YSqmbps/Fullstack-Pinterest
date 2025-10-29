import Image from "../image/image";
import useEditorStore from "../../utils/editorStore";

const Layers = () => {
  const { selectedLayer, setSelectedLayer,addText,canvasOptions } = useEditorStore();
  const handleSelectedLayer = (layer) => {
    setSelectedLayer(layer);

        if (layer === "text") {
          addText();
        }
  };
  return (
    <div className="layers">
      <div className="layersTitle">
        <h3>图层</h3>
        <p>选择一个要编辑的图层</p>
      </div>
      <div
        className={`layer ${selectedLayer === "text" ? "selected" : ""}`}
        onClick={() => handleSelectedLayer("text")}
      >
        <div className="layerImage">
          <Image path="/general/text.png" alt="text" w={48} h={48} />
        </div>
        <span>添加文本</span>
      </div>
      <div 
        className={`layer ${selectedLayer === "canvas" ? "selected" : ""}`} 
        onClick={() => handleSelectedLayer("canvas")}
      >
        <div className="layerImage" style={{ backgroundColor: canvasOptions.backgroundColor }}>
        </div>
        <span>画布</span>
      </div>
    </div>
  );
};

export default Layers;
