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
  handleFontSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFontChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFontWeightChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    setCanvasInstanceRef(canvasInstanceRef.current); // Aktualizuj canvasInstanceRef
  };
  const handleFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFontSize = Number(e.target.value);
    if (canvasInstanceRef.current) {
        const activeObject = canvasInstanceRef.current.getActiveObject();
        console.log("Czy obiekt jest nadal aktywny?", canvasInstanceRef.current.getActiveObject() === activeObject);

        if (activeObject && activeObject.type === 'i-text') {
            // Aplikuj zmianę rozmiaru czcionki
            (activeObject as fabric.IText).set({ fontSize: newFontSize });
            canvasInstanceRef.current.requestRenderAll();

            console.log("Czy obiekt jest nadal aktywny?", canvasInstanceRef.current.getActiveObject() === activeObject);

        }
    }
    setFontSize(newFontSize);
};


  const handleFontChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newFont = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        (activeObject as fabric.IText).set({ fontFamily: newFont });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setSelectedFont(newFont);
  };

  const handleFontWeightChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newFontWeight = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        (activeObject as fabric.IText).set({ fontWeight: newFontWeight });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setFontWeight(newFontWeight);
  };

  const handleColorChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newColor = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === 'i-text') {
        (activeObject as fabric.IText).set({ fill: newColor });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setSelectedColor(newColor);
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
        handleFontWeightChange,
        fontSize,
        setFontSize,
        fontWeight,
        setFontWeight,
        textColor,
        setTextColor,
        addText,
        setCanvasInstanceRef,
        handleColorChange,
        handleFontChange,
        addImage,
        downloadCanvas,
        deleteSelected,
        canvasInstanceRef: canvasInstanceRef.current,
        resetCanvas,
        handleFontSizeChange,
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
function setSelectedColor(newColor: string) {
  
}

