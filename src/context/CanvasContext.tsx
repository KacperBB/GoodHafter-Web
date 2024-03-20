interface ITextExtended extends fabric.IText {
    id: string;
}
"use client";
// CanvasContext.tsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { fabric } from "fabric";
interface CanvasContextProps {
    canvas: fabric.Canvas | null;
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
  }
  
  export const CanvasContext = createContext<CanvasContextProps | undefined>(
    undefined
  );
  
  export const CanvasProvider: React.FC<React.PropsWithChildren<{}>> = ({
    children,
  }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(
      null
    );
    const [selectedFont, setSelectedFont] = useState("Arial");
    const [fontSize, setFontSize] = useState(20);
    const [fontWeight, setFontWeight] = useState("normal");
    const [textColor, setTextColor] = useState("#ffffff");

  const updateTextOnServer = async (selectedObject: ITextExtended) => {
    const response = await fetch('/api/update-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: selectedObject.id,
            text: selectedObject.text,
            fontSize: selectedObject.fontSize,
            fontFamily: selectedObject.fontFamily,
            fontWeight: selectedObject.fontWeight,
            fill: selectedObject.fill,
        }),
    });

    if (!response.ok) {
        console.error('Failed to update text on server');
    }
};

  useEffect(() => {
    if (canvasRef.current && !canvasInstanceRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        height: 400,
        width: 600,
        selection: true,
      });
      canvasInstanceRef.current = initCanvas;
    }
  }, []);

  //Realtime editing
  useEffect(() => {
    if (canvasInstanceRef.current) {
        canvasInstanceRef.current.on("selection:created", (e) => {
        const selectedObject = { ...(e.target as fabric.IText), id: 'some-id' } as ITextExtended;
        if (selectedObject && selectedObject.type === "i-text") {
            setSelectedObject(selectedObject);
            updateTextOnServer(selectedObject);
        }
        });

        canvasInstanceRef.current.on("selection:updated", (e) => {
        const selectedObject = { ...(e.target as fabric.IText), id: 'some-id' } as ITextExtended;
        if (selectedObject && selectedObject.type === "i-text") {
            setSelectedObject(selectedObject);
            updateTextOnServer(selectedObject);
        }
        });
  
        canvasInstanceRef.current.on("selection:cleared", () => {
          setSelectedObject(null);
          // Here you would call your function to clear the selected text on the server
          // clearSelectedText();
        });
      canvasInstanceRef.current.on('selection:created', (e) => {
        const selectedObject = e.target;
        if (selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'image')) {
          setSelectedObject(selectedObject);
        }
      });
      
      canvasInstanceRef.current.on('selection:updated', (e) => {
        const selectedObject = e.target;
        if (selectedObject && (selectedObject.type === 'i-text' || selectedObject.type === 'image')) {
          setSelectedObject(selectedObject);
        }
      });
      
      // Dodaj funkcję do aktualizacji wybranego obrazu
      const updateSelectedImage = (newProps: Partial<fabric.IImageOptions>) => {
        if (selectedObject && selectedObject.type === 'image') {
          selectedObject.set(newProps);
          canvasInstanceRef.current?.requestRenderAll();
        }
      };
    }
  }, [selectedObject]);

  const addText = () => {
    const text = new fabric.IText("Twój tekst", {
      left: 50,
      top: 50,
      fontSize: fontSize,
      fontFamily: selectedFont,
      fontWeight: fontWeight,
      fill: textColor,
      selectable: true,
      hasControls: true,
    });

    text.on("mouse:dblclick", () => {
      text.enterEditing();
    });

    const addImage = (url: string) => {
        fabric.Image.fromURL(url, function (img) {
          if (canvasInstanceRef.current && img) {
            img.set({
              left: 50,
              top: 50,
              selectable: true,
              hasControls: true,
            });
            canvasInstanceRef.current.add(img);
            canvasInstanceRef.current.setActiveObject(img);
            canvasInstanceRef.current.requestRenderAll();
          }
        });
      };
      
    canvasInstanceRef.current?.add(text);
    canvasInstanceRef.current?.setActiveObject(text);
    canvasInstanceRef.current?.requestRenderAll();
  };

  const downloadCanvas = () => {
    if (canvasInstanceRef.current) {
      const dataUrl = canvasInstanceRef.current.toDataURL({ format: 'png' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'canvas.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  //funckja do aktualizacji wybranego tekstu
  const updateSelectedText = (newProps: Partial<fabric.ITextOptions>) => {
    if (selectedObject && selectedObject.type === "i-text") {
      selectedObject.set(newProps);
      canvasInstanceRef.current?.requestRenderAll();
    }
  };
  const addImage = (url: string) => {
    fabric.Image.fromURL(url, function (img) {
      if (canvasInstanceRef.current && img) {
        img.set({
          left: 50,
          top: 50,
          selectable: true,
          hasControls: true,
        });
        canvasInstanceRef.current.add(img);
        canvasInstanceRef.current.setActiveObject(img);
        canvasInstanceRef.current.requestRenderAll();
      }
    });

  };

  const deleteSelected = () => {
    if (canvasInstanceRef.current) {
      const activeObjects = canvasInstanceRef.current.getActiveObjects();
      canvasInstanceRef.current.remove(...activeObjects);
    }
  };

  const resetCanvas = () => {
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.clear();
    }
  };
  return (
    <CanvasContext.Provider
      value={{
        canvas: canvasInstanceRef.current,
        selectedFont,
        downloadCanvas,
        setSelectedFont,
        addImage,
        fontSize,
        setFontSize,
        fontWeight,
        setFontWeight,
        textColor,
        setTextColor,
        addText,
        deleteSelected,
        resetCanvas,
      }}
    >
           <canvas ref={canvasRef} />
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
  
  export default useCanvas;