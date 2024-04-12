import { fabric } from "fabric";
import { RefObject } from "react";

export const moveObject =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setObjects: (objects: fabric.Object[]) => void) =>
  (direction: "up" | "down", displayedIndex: number) => {
    if (canvasInstanceRef && canvasInstanceRef.current) {
      const objects = canvasInstanceRef.current.getObjects();
      const actualIndex = objects.length - 1 - displayedIndex;
      const object = canvasInstanceRef.current.item(
        actualIndex
      ) as unknown as fabric.Object; // Pobieramy obiekt z płótna i rzutujemy go na fabric.Object

      if (object) {
        let newIndex = direction === "up" ? actualIndex + 1 : actualIndex - 1;
        // Zapewniamy, że nowy indeks jest w zakresie
        newIndex = Math.max(
          0,
          Math.min(canvasInstanceRef.current.size() - 1, newIndex)
        );

        if (newIndex !== actualIndex) {
          canvasInstanceRef.current.moveTo(object, newIndex);
          canvasInstanceRef.current.renderAll();

          // Aktualizujemy stan obiektów, aby odzwierciedlić zmianę
          setObjects(canvasInstanceRef.current.getObjects());
        }
      }
    }
  };