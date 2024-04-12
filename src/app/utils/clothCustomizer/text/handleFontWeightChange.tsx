import { fabric } from "fabric";
import { RefObject } from "react";

export const handleFontWeightChange =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setFontWeight: Function) =>
  (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontWeight = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fontWeight: newFontWeight });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setFontWeight(newFontWeight);
  };