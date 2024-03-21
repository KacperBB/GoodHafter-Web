// useCanvas.ts
import { useContext } from "react";
import { CanvasContext } from "./CanvasContext";

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};

export default useCanvas;