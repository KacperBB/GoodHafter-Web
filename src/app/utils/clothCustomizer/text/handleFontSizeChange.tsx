import { fabric } from "fabric";
import { RefObject } from "react";

export const handleFontSizeChange =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setFontSize: Function) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFontSize = Number(e.target.value);
    if (canvasInstanceRef && canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();

      if (activeObject && activeObject.type === "i-text") {
        // Aplikuj zmianę rozmiaru czcionki
        (activeObject as fabric.IText).set({ fontSize: newFontSize });
        canvasInstanceRef.current.requestRenderAll();
      }
    }
    setFontSize(newFontSize);
  };