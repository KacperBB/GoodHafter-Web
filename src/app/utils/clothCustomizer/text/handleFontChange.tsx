import { fabric } from "fabric";
import { RefObject } from "react";

export const handleFontChange =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setSelectedFont: Function) =>
  (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFont = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fontFamily: newFont });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setSelectedFont(newFont);
  };