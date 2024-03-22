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
  isLoading: boolean;
  resetCanvas: () => void;
  canvas: fabric.Canvas | null; 
  setCanvasInstanceRef: (canvas: fabric.Canvas | null) => void;
  canvasInstanceRef?: fabric.Canvas | null; // Dodaj tę linię
  objects: fabric.Object[];
    moveObject: (direction: 'up' | 'down', index: number) => void;
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
const [isLoading, setIsLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
  const setCanvasInstanceRef = (canvas: fabric.Canvas | null) => {
    canvasInstanceRef.current = canvas;
  };
  const addText = () => {
    const text = new fabric.IText("Twój tekst", {
      left: 50,
      top: 50,
      fontSize: fontSize || 20,
      fontFamily: selectedFont || "Arial",
      fontWeight: fontWeight || "normal",
      fill: textColor || "#000000",
      selectable: true,
      hasControls: true,
      name: "Twój tekst",
    });
    text.toObject = ((toObject) => {
      return function(this: fabric.IText) {
        return fabric.util.object.extend(toObject.call(this), {
          name: this.name
        });
      };
    })(text.toObject);
    text.on('modified', function(this: fabric.IText) {
      this.set({ name: this.text }); // Aktualizujemy nazwę obiektu na jego zawartość
      setObjects(canvasInstanceRef.current?.getObjects() || []); // Aktualizujemy stan obiektów
    });
    if (canvasInstanceRef.current) {
      canvasInstanceRef.current.add(text);
      setObjects(prevObjects => [...prevObjects, text.toObject()]); // Aktualizuj stan objects
      canvasInstanceRef.current.renderAll();
    }
    setCanvasInstanceRef(canvasInstanceRef.current); // Aktualizuj canvasInstanceRef
  };

  const handleFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newFontSize = Number(e.target.value);
    if (canvasInstanceRef && canvasInstanceRef.current) {
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
          name: url,
        });
        img.toObject = ((toObject) => {
          return function(this: fabric.Image) {
            return fabric.util.object.extend(toObject.call(this), {
              name: this.name
            });
          };
        })(img.toObject);
        const existingObject = canvasInstanceRef.current?.getObjects().find(o => o.toObject() === img.toObject());
        if (!existingObject) {
          // Jeśli obiekt nie istnieje, dodaj go do płótna
          canvasInstanceRef.current?.add(img);
          setObjects(canvasInstanceRef.current?.getObjects() || []); // Aktualizuj stan objects
        }
      });
    }
  };

  const deleteSelected = () => {
    if (canvasInstanceRef.current) {
      const activeObjects = canvasInstanceRef.current.getActiveObjects();
      activeObjects.forEach((obj) => canvasInstanceRef.current?.remove(obj));
      setObjects(prevObjects => prevObjects.filter(obj => !activeObjects.includes(obj.toObject()))); // Aktualizuj stan objects
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

  const moveObject = (direction: 'up' | 'down', displayedIndex: number) => {
    if (canvasInstanceRef && canvasInstanceRef.current) {
      const actualIndex = objects.length - 1 - displayedIndex;
      const object = canvasInstanceRef.current.item(actualIndex) as unknown as fabric.Object; // Pobieramy obiekt z płótna i rzutujemy go na fabric.Object

      if (object) {
        let newIndex = direction === 'up' ? actualIndex + 1 : actualIndex - 1;
        // Zapewniamy, że nowy indeks jest w zakresie
        newIndex = Math.max(0, Math.min(canvasInstanceRef.current.size() - 1, newIndex));

        if (newIndex !== actualIndex) {
          canvasInstanceRef.current.moveTo(object, newIndex);
          canvasInstanceRef.current.renderAll();

          // Aktualizujemy stan obiektów, aby odzwierciedlić zmianę
          setObjects(canvasInstanceRef.current.getObjects());
        }
      }
    }
  };

useEffect(() => {
  if (canvasInstanceRef.current) {
    const savedObjects = canvasInstanceRef.current.getObjects().map(obj => obj.toObject());
    localStorage.setItem('objects', JSON.stringify(savedObjects));
  }
  setIsLoading(false); // Aktualizacja stanu isLoading
}, [canvasInstanceRef, setIsLoading]);

// Odczytaj obiekty z localStorage, gdy komponent jest montowany
useEffect(() => {
  const savedObjects = localStorage.getItem('objects');
  if (savedObjects) {
    const objectsToLoad = JSON.parse(savedObjects);
    const enlivenedObjects: fabric.Object[] = [];
    let loadedImages = 0;
    objectsToLoad.forEach((obj: any) => {
      switch (obj.type) {
        case 'rect':
          enlivenedObjects.push(new fabric.Rect(obj));
          break;
        case 'circle':
          enlivenedObjects.push(new fabric.Circle(obj));
          break;
        case 'triangle':
          enlivenedObjects.push(new fabric.Triangle(obj));
          break;
        case 'i-text':
          if (obj.text) { // Dodaj to sprawdzenie
            enlivenedObjects.push(new fabric.IText(obj.text, obj));
          }
          break;
        case 'image':
          fabric.Image.fromURL(obj.src, (img) => {
            img.set(obj);
            enlivenedObjects.push(img);
            loadedImages++;
            if (loadedImages === objectsToLoad.filter((o: { type: string; }) => o.type === 'image').length) {
              setObjects(enlivenedObjects);
              if (canvasInstanceRef.current) {
                if (canvasInstanceRef.current) {
                enlivenedObjects.forEach((obj: fabric.Object) => {
                  canvasInstanceRef.current?.add(obj);
                });
                setObjects(canvasInstanceRef.current.getObjects());
                }
              }
            }
          });
          break;
        // Dodaj tutaj inne typy obiektów, które chcesz obsłużyć
        default:
          return null;
      }
    });
  }
}, []);

  return (
    <CanvasContext.Provider
      value={{
        selectedFont,
        isLoading,
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

