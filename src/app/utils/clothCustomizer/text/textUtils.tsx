import { fabric } from "fabric";
import { RefObject } from "react";

export const addText = (
  canvasInstanceRef: RefObject<fabric.Canvas>,
  setObjects: (objects: fabric.Object[]) => void,
  fontSize: number,
  selectedFont: string,
  fontWeight: string,
  textColor: string
) => {
  const text = new fabric.IText("Twój tekst", {
    left: (canvasInstanceRef.current?.width || 0) / 2,
    top: (canvasInstanceRef.current?.height || 0) / 2,
    originX: "center",
    originY: "center",
    fontSize: fontSize || 20,
    fontFamily: selectedFont || "Arial",
    fontWeight: fontWeight || "normal",
    fill: textColor || "#000000",
    selectable: true,
    hasControls: true,
    name: "Twój tekst",
  });

  text.toObject = ((toObject) => {
    return function (this: fabric.IText) {
      return fabric.util.object.extend(toObject.call(this), {
        name: this.name,
      });
    };
  })(text.toObject);

  text.on("modified", function (this: fabric.IText) {
    this.set({ name: this.text }); // Aktualizujemy nazwę obiektu na jego zawartość
    setObjects(canvasInstanceRef.current?.getObjects() || []); // Aktualizujemy stan obiektów
  });

  if (canvasInstanceRef.current) {
    canvasInstanceRef.current.add(text);
    setObjects(canvasInstanceRef.current.getObjects()); // Aktualizuj stan objects
    canvasInstanceRef.current.renderAll();
  }
};