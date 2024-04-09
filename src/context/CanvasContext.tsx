"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react"; // Importuje potrzebne funkcje i hooki z Reacta
import { fabric } from "fabric"; // Importuje fabric z biblioteki fabric.js
import { addImage as addImageUtil } from "../lib/imageUtils"; // Importuje funkcję addImage z pliku imageUtils w folderze lib
import { addText as addTextUtil } from "../lib/textUtils"; // Importuje funkcję addText z pliku textUtils w folderze lib

// Definicja interfejsu dla właściwości kontekstu CanvasContext
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
  resetCanvas: () => void; // Dodaje funkcję resetCanvas
  canvas: fabric.Canvas | null;
  setCanvasInstanceRef: (canvas: fabric.Canvas | null) => void;
  canvasInstanceRef?: fabric.Canvas | null;
  objects: fabric.Object[];
  setObjects: React.Dispatch<React.SetStateAction<fabric.Object[]>>;
  moveObject: (direction: "up" | "down", index: number) => void;
}

// Tworzenie kontekstu CanvasContext
export const CanvasContext = createContext<CanvasContextProps | undefined>(
  undefined
);

// Komponent dostarczający kontekst CanvasContext
export const CanvasProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFont, setSelectedFont] = useState("Arial"); // Stan dla wybranej czcionki
  const [fontSize, setFontSize] = useState(20); // Stan dla rozmiaru czcionki
  const [fontWeight, setFontWeight] = useState("normal"); // Stan dla grubości czcionki
  const [textColor, setTextColor] = useState("#000000"); // Stan dla koloru tekstu
  const [objects, setObjects] = useState<fabric.Object[]>([]); // Stan dla obiektów na płótnie
  const [isLoading, setIsLoading] = useState(true); // Stan dla informacji o ładowaniu

  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Referencja do elementu canvas
  const canvasInstanceRef = useRef<fabric.Canvas | null>(null); // Referencja do instancji fabric.Canvas
  const setCanvasInstanceRef = (canvas: fabric.Canvas | null) => {
    canvasInstanceRef.current = canvas;
  };

  // Funkcja do dodawania tekstu na płótnie
  const addText = () => {
    addTextUtil(
      canvasInstanceRef,
      setObjects,
      fontSize,
      selectedFont,
      fontWeight,
      textColor
    );
  };

  // Obsługa zmiany rozmiaru czcionki
  const handleFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const newFontSize = Number(e.target.value);
    if (canvasInstanceRef && canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      console.log(
        "Czy obiekt jest nadal aktywny?",
        canvasInstanceRef.current.getActiveObject() === activeObject
      );

      if (activeObject && activeObject.type === "i-text") {
        // Aplikuj zmianę rozmiaru czcionki
        (activeObject as fabric.IText).set({ fontSize: newFontSize });
        canvasInstanceRef.current.requestRenderAll();

        console.log(
          "Czy obiekt jest nadal aktywny?",
          canvasInstanceRef.current.getActiveObject() === activeObject
        );
      }
    }
    setFontSize(newFontSize);
  };

  // Obsługa zmiany czcionki
  const handleFontChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const newFont = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fontFamily: newFont });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setSelectedFont(newFont);
  };

  // Obsługa zmiany grubości czcionki
  const handleFontWeightChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    const newFontWeight = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fontWeight: newFontWeight });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setFontWeight(newFontWeight);
  };

  // Obsługa zmiany koloru tekstu
  const handleColorChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const newColor = e.target.value;
    if (canvasInstanceRef.current) {
      const activeObject = canvasInstanceRef.current.getActiveObject();
      if (activeObject && activeObject.type === "i-text") {
        (activeObject as fabric.IText).set({ fill: newColor });
        canvasInstanceRef.current.requestRenderAll();
        canvasInstanceRef.current.setActiveObject(activeObject);
      }
    }
    setTextColor(newColor);
  };

  // Funkcja do dodawania obrazów na płótnie
  const addImage = (url: string) => {
    addImageUtil(canvasInstanceRef, setObjects)(url);
  };

  // Funkcja do usuwania zaznaczonych obiektów
  const deleteSelected = () => {
    if (canvasInstanceRef.current) {
      const activeObjects = canvasInstanceRef.current.getActiveObjects();
      activeObjects.forEach((obj) => canvasInstanceRef.current?.remove(obj));
      setObjects((prevObjects) =>
        prevObjects.filter((obj) => !activeObjects.includes(obj))
      ); // Aktualizuj stan objects
      canvasInstanceRef.current.renderAll(); // Dodajemy to, aby wymusić renderowanie
    }
  };

  // Funkcja do resetowania płótna
  const resetCanvas = () => {
    if (canvasInstanceRef.current) {
      setIsLoading(true); // Ustaw flagę isLoading na true
      canvasInstanceRef.current.clear();
      setObjects([]); // Resetuj stan obiektów
      localStorage.removeItem("objects"); // Usuń obiekty z localStorage
      canvasInstanceRef.current.renderAll(); // Dodajemy to, aby wymusić renderowanie
      setIsLoading(false); // Ustaw flagę isLoading na false po zakończeniu resetowania
    }
  };

  // Funkcja do pobierania obrazu z płótna
  const downloadCanvas = () => {
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

  // Funkcja do przesuwania obiektów na płótnie
  const moveObject = (direction: "up" | "down", displayedIndex: number) => {
    if (canvasInstanceRef && canvasInstanceRef.current) {
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

  useEffect(() => {
    if (canvasInstanceRef.current) {
      const savedObjects = canvasInstanceRef.current
        .getObjects()
        .map((obj) => obj.toObject());
      localStorage.setItem("objects", JSON.stringify(savedObjects));
    }
    setIsLoading(false); // Aktualizacja stanu isLoading
  }, [canvasInstanceRef, setIsLoading]);

  // Odczytaj obiekty z localStorage, gdy komponent jest montowany
  useEffect(() => {
    const savedObjects = localStorage.getItem("objects");
    if (savedObjects) {
      const objectsToLoad = JSON.parse(savedObjects);
      const enlivenedObjects: fabric.Object[] = [];
      let loadedImages = 0;
      objectsToLoad.forEach((obj: any) => {
        switch (obj.type) {
          case "rect":
            enlivenedObjects.push(new fabric.Rect(obj));
            break;
          case "circle":
            enlivenedObjects.push(new fabric.Circle(obj));
            break;
          case "triangle":
            enlivenedObjects.push(new fabric.Triangle(obj));
            break;
          case "i-text":
            if (obj.text) {
              // Dodaj to sprawdzenie
              enlivenedObjects.push(new fabric.IText(obj.text, obj));
            }
            break;
          case "image":
            fabric.Image.fromURL(obj.src, (img) => {
              img.set(obj);
              enlivenedObjects.push(img);
              loadedImages++;
              if (
                loadedImages ===
                objectsToLoad.filter(
                  (o: { type: string }) => o.type === "image"
                ).length
              ) {
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
        setObjects,
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

// Hook do użycia kontekstu CanvasContext
export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
