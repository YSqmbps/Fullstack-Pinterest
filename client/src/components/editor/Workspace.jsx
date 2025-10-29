import { useEffect, useRef } from "react";
import useEditorStore from "../../utils/editorStore";
import Image from "../image/image";

const Workspace = ({ previewImg }) => {
  const {
    textOptions,
    setTextOptions,
    canvasOptions,
    setCanvasOptions,
    selectedLayer,
    setSelectedLayer,
  } = useEditorStore();

  useEffect(() => {
    if (canvasOptions.height === 0) {
      const canvasHeight = (375 * previewImg.height) / previewImg.width;

      setCanvasOptions({
        ...canvasOptions,
        height: canvasHeight,
        orientation: canvasHeight > 375 ? "portrait" : "landscape",
      });
    }
  }, [previewImg, canvasOptions, setCanvasOptions]);

  const itemRef = useRef(null);
  const containerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!dragging.current) return;
    setTextOptions({
      ...textOptions,
      left: e.clientX - offset.current.x,
      top: e.clientY - offset.current.y,
    });
  };
  const handleMouseUp = (e) => {
    dragging.current = false;
  };
  const handleMouseLeave = (e) => {
    dragging.current = false;
  };
  const handleMouseDown = (e) => {
    setSelectedLayer("text");
    dragging.current = true;
    offset.current = {
      x: e.clientX - textOptions.left,
      y: e.clientY - textOptions.top,
    };
  };
  return (
    <div className="workspace">
      <div
        className="canvas"
        style={{
          width: "375px", // 设置固定宽度
          height: canvasOptions.height,
          backgroundColor: canvasOptions.backgroundColor,
          position: "relative", // 确保内部元素可以定位
          margin: "0 auto", // 可选：让canvas居中显示
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        ref={containerRef}
      >
        {/* 为图片添加样式，确保在固定宽度的canvas中正确显示 */}
        <img
          src={previewImg.url}
          alt=""
          style={{
            width: "100%", // 图片宽度充满canvas
            height: "auto", // 高度自动适应，保持比例
            display: "block", // 防止图片下方出现空白
          }}
        />
        {textOptions.text && (
          <div
            className="text"
            style={{
              left: textOptions.left,
              top: textOptions.top,
              fontSize: `${textOptions.fontSize}px`,
            }}
            onMouseDown={handleMouseDown}
            ref={itemRef}
          >
            <input
              type="text"
              value={textOptions.text}
              onChange={(e) =>
                setTextOptions({ ...textOptions, text: e.target.value })
              }
              style={{
                color: textOptions.color,
              }}
            />
            <div
              className="deleteTextButton"
              onClick={() => setTextOptions({ ...textOptions, text: "" })}
            >
              <Image path="/general/delete.svg" alt="" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
