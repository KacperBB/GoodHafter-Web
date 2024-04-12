import { fabric } from "fabric";
import { RefObject } from "react";

export const downloadCanvas =
  (canvasInstanceRef: RefObject<fabric.Canvas>) =>
  () => {
    if (canvasInstanceRef.current) {
      const canvasEl = (canvasInstanceRef.current as any)
        .lowerCanvasEl as HTMLCanvasElement;
      try {
        canvasEl.toBlob((blob: Blob | null) => {
          if (blob !== null) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "canvas-image.png";
            link.click();
            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 100);
          }
        }, "image/png");
      } catch (error) {
        console.error("Failed to download canvas image:", error);
      }
    }
  };