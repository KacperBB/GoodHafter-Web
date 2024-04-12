import { fabric } from "fabric";
import { RefObject } from "react";

export const deleteSelected =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setObjects: (objects: fabric.Object[]) => void) =>
  () => {
    if (canvasInstanceRef.current) {
      const activeObjects = canvasInstanceRef.current.getActiveObjects();
      activeObjects.forEach((obj) => canvasInstanceRef.current?.remove(obj));
      const newObjects = canvasInstanceRef.current.getObjects();
      setObjects(newObjects); // Aktualizuj stan objects
      canvasInstanceRef.current.renderAll(); // Dodajemy to, aby wymusić renderowanie
    }
  };