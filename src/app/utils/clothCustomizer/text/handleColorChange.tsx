import { fabric } from "fabric";
import { RefObject } from "react";

export const handleColorChange =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setTextColor: Function) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fill: newColor });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setTextColor(newColor);
  };