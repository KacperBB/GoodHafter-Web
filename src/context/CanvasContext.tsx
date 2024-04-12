"use client";

import { createContext, useContext, useState, useRef, useEffect } from "react"; // Importuje potrzebne funkcje i hooki z Reacta
import { fabric } from "fabric"; // Importuje fabric z biblioteki fabric.js
import { addImage as addImageUtil } from "../app/utils/clothCustomizer/imageUtils"; // Importuje funkcję addImage z pliku imageUtils w folderze lib
import { addText as addTextUtil } from "../app/utils/clothCustomizer/text/textUtils"; // Importuje funkcję addText z pliku textUtils w folderze lib
import { handleFontSizeChange as handleFontSizeChangeUtil } from "../app/utils/clothCustomizer/text/handleFontSizeChange";
import { handleFontChange as handleFontChangeUtil } from "../app/utils/clothCustomizer/text/handleFontChange";
import { handleFontWeightChange as handleFontWeightChangeUtil } from "../app/utils/clothCustomizer/text/handleFontWeightChange";
import { handleColorChange as handleColorChangeUtil } from "../app/utils/clothCustomizer/text/handleColorChange";
import { deleteSelected as deleteSelectedUtil } from "../app/utils/clothCustomizer/canvas/deleteSelected";
import { resetCanvas as resetCanvasUtil } from "../app/utils/clothCustomizer/canvas/resetCanvas";
import { downloadCanvas as downloadCanvasUtil } from "../app/utils/clothCustomizer/canvas/downloadCanvas";
import { moveObject as moveObjectUtil } from "../app/utils/clothCustomizer/navigation/moveObject";
import { CanvasContextProps } from "../lib/CanvasContextProps";

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
  const handleFontSizeChange = handleFontSizeChangeUtil(
    canvasInstanceRef,
    setFontSize
  );

  // Obsługa zmiany czcionki
  const handleFontChange = handleFontChangeUtil(
    canvasInstanceRef,
    setSelectedFont
  );

  // Obsługa zmiany grubości czcionki
  const handleFontWeightChange = handleFontWeightChangeUtil(
    canvasInstanceRef,
    setFontWeight
  );

  // Obsługa zmiany koloru tekstu
  const handleColorChange = handleColorChangeUtil(
    canvasInstanceRef,
    setTextColor
  );

  // Funkcja do dodawania obrazów na płótnie
  const addImage = (url: string) => {
    addImageUtil(canvasInstanceRef, setObjects)(url);
  };

  // Funkcja do usuwania zaznaczonych obiektów
  const deleteSelected = deleteSelectedUtil(canvasInstanceRef, setObjects);

  // Funkcja do resetowania płótna
  const resetCanvas = resetCanvasUtil(
    canvasInstanceRef,
    setObjects,
    setIsLoading
  );

  // Funkcja do pobierania obrazu z płótna
  const downloadCanvas = downloadCanvasUtil(canvasInstanceRef);

  // Funkcja do przesuwania obiektów na płótnie
  const moveObject = moveObjectUtil(canvasInstanceRef, setObjects);

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
