import { useState } from "react";
import { ChromePicker } from "react-color";
import useEditorStore from "../../utils/editorStore";

const portraitSizes = [
  {
    name: "1:2",
    width: 1,
    height: 2,
  },
  {
    name: "9:16",
    width: 9,
    height: 16,
  },
  {
    name: "2:3",
    width: 2,
    height: 3,
  },
  {
    name: "3:4",
    width: 3,
    height: 4,
  },
  {
    name: "4:5",
    width: 4,
    height: 5,
  },
  {
    name: "5:4",
    width: 5,
    height: 4,
  },
  {
    name: "1:1",
    width: 1,
    height: 1,
  },
];

const landscapeSizes = [
  {
    name: "2:1",
    width: 2,
    height: 1,
  },
  {
    name: "16:9",
    width: 16,
    height: 9,
  },
  {
    name: "3:2",
    width: 3,
    height: 2,
  },
  {
    name: "4:3",
    width: 4,
    height: 3,
  },
  {
    name: "5:4",
    width: 5,
    height: 4,
  },
  {
    name: "1:1",
    width: 1,
    height: 1,
  },
];

const Options = ({ previewImg }) => {
  const {
    selectedLayer,
    textOptions,
    setTextOptions,
    canvasOptions,
    setCanvasOptions,
  } = useEditorStore();
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleSizeClick = (size) => {
    let newHeight;

    if(size === "original"){
      if(canvasOptions.orientation === "portrait"){
        newHeight = (375 * previewImg.width) / previewImg.height;
      } else {
        newHeight = (375 * previewImg.height) / previewImg.width;
      }
    } else {
      newHeight = (375 * size.height) / size.width;
    }
    setCanvasOptions({
      ...canvasOptions,
      size: size.name,
      height: newHeight,
      // 添加width属性，使其与size.width保持一致
      width: size.width
    });
  };
  
  // 确保handleOrientationClick函数被正确定义并放置在合适的位置
  const handleOrientationClick = (orientation) => {
    const newHeight = orientation === "portrait"
      ? (375 * previewImg.width) / previewImg.height
      : (375 * previewImg.height) / previewImg.width;
    setCanvasOptions({
      ...canvasOptions,
      orientation,
      size: "original",
      height: newHeight,
      width: previewImg.width
    });
  };


  
  return (
    <div className="options">
      {selectedLayer === "text" ? (
        <div className="textOptions">
          <div className="editingOption">
            <span>字体大小</span>
            <input
              type="number"
              value={textOptions.fontSize}
              onChange={(e) =>
                setTextOptions({ ...textOptions, fontSize: e.target.value })
              }
            />
          </div>
          <div className="editingOption">
            <span>字体颜色</span>
            <div className="textColor" style={{ position: "relative" }}>
              <div
                className="colorPreview"
                style={{ backgroundColor: textOptions.color }}
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              >
                {isColorPickerOpen && (
                  <div className="colorPicker">
                    <ChromePicker
                      color={textOptions.color}
                      onChange={(color) =>
                        setTextOptions({ ...textOptions, color: color.hex })
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="">
          <div className="editingOption">
            <span>图片选项</span>
            <div className="orientations">
              <div
                className={`orientation ${
                  canvasOptions.orientation === "portrait" ? "selected" : ""
                }`}
                onClick={() => handleOrientationClick("portrait")}
              >
                纵向
              </div>
              <div
                className={`orientation ${
                  canvasOptions.orientation === "landscape" ? "selected" : ""
                }`}
                onClick={() => handleOrientationClick("landscape")}
              >
                横向
              </div>
            </div>
          </div>
          <div className="editingOption">
            <span>图片大小</span>
            <div className="sizes">
              <div
                className={`size ${
                  canvasOptions.size === "original" ? "selected" : ""
                }`}
                onClick={() => handleSizeClick("original")}
              >
                初始大小
              </div>
              {canvasOptions.orientation === "portrait" ? (
                <>
                  {portraitSizes.map((size) => (
                    <div
                      className={`size ${
                        canvasOptions.size === size.name ? "selected" : ""
                      }`}
                      key={size.name}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size.name}
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {landscapeSizes.map((size) => (
                    <div
                      className={`size ${
                        canvasOptions.size === size.name ? "selected" : ""
                      }`}
                      key={size.name}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size.name}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="editingOption">
            <span>背景颜色</span>
            <div className="bgColor">
              <div className="textColor">
                <div
                  className="colorPreview"
                  style={{ backgroundColor: canvasOptions.backgroundColor }}
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  {isColorPickerOpen && (
                    <div className="colorPicker">
                      <ChromePicker
                        color={canvasOptions.backgroundColor}
                        onChange={(color) =>
                          setCanvasOptions({
                            ...canvasOptions,
                            backgroundColor: color.hex,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Options;