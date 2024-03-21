"use client";

// CanvasContext.tsx
import {
  createContext,
  useContext,
  useState,
  useRef,
} from "react";
import { fabric } from "fabric";

interface CanvasContextProps {
  selectedFont: string;
  setSelectedFont: React.Dispatch<React.SetStateAction<string>>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  fontWeight: string;
  setFontWeight: React.Dispatch<React.SetStateAction<string>>;
  textColor: string;
  setTextColor: React.Dispatch<React.SetStateAction<string>>;
  addText: () => void;
  addImage: (url: string) => void;
  downloadCanvas: () => void;
  deleteSelected: () => void;
  resetCanvas: () => void;
  canvas: fabric.Canvas | null;
  setCanvasInstanceRef: (canvas: fabric.Canvas | null) => void; // Dodaj tę linię
  canvasInstanceRef?: fabric.Canvas | null; // Dodaj tę linię
}

export const CanvasContext = createContext<CanvasContextProps | undefined>(
  undefined
);

export const CanvasProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [fontSize, setFontSize] = useState(20);
  const [fontWeight, setFontWeight] = useState("normal");
  const [textColor, setTextColor] = useState("#ffffff");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const setCanvasInstanceRef = (canvas: fabric.Canvas | null) => {
    canvasInstanceRef.current = canvas;
  };

  const addText = () => {
    const text = new fabric.IText("Twój tekst", {
      left: 50,
      top: 50,
      fontSize,
      fontFamily: selectedFont,
      fontWeight,
      fill: textColor,
      selectable: true,
      hasControls: true,
    });
    text.on("mouse:down", () => {
      console.log("Text clicked", text);
    });
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.add(text);
      canvasInstanceRef.current.renderAll();
      console.log("Text added", text);
      console.log(
        "Current objects on canvas",
        canvasInstanceRef.current.getObjects()
      );
    }
  };

  const addImage = (url: string) => {
    if (canvasInstanceRef.current) {
      fabric.Image.fromURL(url, (img) => {
        img.set({
          left: 50,
          top: 50,
          selectable: true,
          hasControls: true,
        });
        canvasInstanceRef.current?.add(img);
      });
    }
  };

  const deleteSelected = () => {
    if (canvasInstanceRef.current) {
      const activeObjects = canvasInstanceRef.current.getActiveObjects();
      if (activeObjects) {
        activeObjects.forEach((obj) => canvasInstanceRef.current?.remove(obj));
      }
    }
  };

  const resetCanvas = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.clear();
    }
  };

  const downloadCanvas = () => {
    if (canvasInstanceRef.current) {
      const canvasEl = (canvasInstanceRef.current as any)
        .lowerCanvasEl as HTMLCanvasElement;
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
    }
  };

  return (
    <CanvasContext.Provider
      value={{
        selectedFont,
        setSelectedFont,
        fontSize,
        setFontSize,
        fontWeight,
        setFontWeight,
        textColor,
        setTextColor,
        addText,
        setCanvasInstanceRef, // Zmień setCanvas na setCanvasInstanceRef
        addImage,
        downloadCanvas,
        deleteSelected,
        canvasInstanceRef: canvasInstanceRef.current,
        resetCanvas,
        canvas: canvasInstanceRef.current,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};

export default CanvasProvider;
