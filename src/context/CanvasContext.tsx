"use client";

// CanvasContext.tsx
import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
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
  setCanvasInstanceRef: (canvas: fabric.Canvas | null) => void;
  canvasInstanceRef?: fabric.Canvas | null; // Dodaj tę linię
  objects: fabric.Object[];
  moveObject: (direction: 'up' | 'down') => void;
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
  const [objects, setObjects] = useState<fabric.Object[]>([]);

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
        setObjects(canvasInstanceRef.current.getObjects());
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
        if (canvasInstanceRef.current) {
          canvasInstanceRef.current.add(img);
          setObjects(canvasInstanceRef.current.getObjects()); // Aktualizuj stan objects
        }
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
      setObjects([]); // Resetuj stan obiektów
      localStorage.removeItem('objects'); // Usuń obiekty z localStorage
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


const moveObject = (direction: 'up' | 'down') => {
    const activeObject = canvasInstanceRef.current?.getActiveObject();
    if (activeObject) {
        if (direction === 'up') {
            activeObject.bringForward();
        } else {
            activeObject.sendBackwards();
        }
        canvasInstanceRef.current?.requestRenderAll();
    }
};
// Zapisz obiekty do localStorage za każdym razem, gdy są aktualizowane
useEffect(() => {
  if (canvasInstanceRef.current) {
    const objectsToSave = canvasInstanceRef.current.getObjects().map(o => o.toObject());
    localStorage.setItem('objects', JSON.stringify(objectsToSave));
  }
}, [objects]);

// Zapisz obiekty do localStorage za każdym razem, gdy są aktualizowane
useEffect(() => {
  if (canvasInstanceRef.current) {
    const objectsToSave = canvasInstanceRef.current.getObjects().map(o => ({
      type: o.type,
      left: o.left,
      top: o.top,
      width: o.width,
      height: o.height,
      fill: o.fill,
      // Dodaj tutaj inne właściwości, które chcesz zachować
    }));
    localStorage.setItem('objects', JSON.stringify(objectsToSave));
  }
}, [objects]);

// Odczytaj obiekty z localStorage, gdy komponent jest montowany
useEffect(() => {
  const savedObjects = localStorage.getItem('objects');
  if (savedObjects) {
    const objectsToLoad = JSON.parse(savedObjects);
    const enlivenedObjects = objectsToLoad.map((obj: any) => {
      switch (obj.type) {
        case 'rect':
          return new fabric.Rect(obj);
        case 'circle':
          return new fabric.Circle(obj);
        case 'triangle':
          return new fabric.Triangle(obj);
        case 'i-text':
          return new fabric.IText('Twój tekst', obj);
        // Dodaj tutaj inne typy obiektów, które chcesz obsłużyć
        default:
          return null;
      }
    }).filter((obj: fabric.Object | null) => obj !== null);
    setObjects(enlivenedObjects);
    if (canvasInstanceRef.current) {
      enlivenedObjects.forEach((obj: fabric.Object) => canvasInstanceRef.current?.add(obj));
    }
  }
}, []);

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
        moveObject,
        objects,
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

