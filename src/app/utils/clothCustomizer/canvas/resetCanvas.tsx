import { fabric } from "fabric";
import { RefObject } from "react";

export const resetCanvas =
  (canvasInstanceRef: RefObject<fabric.Canvas>, setObjects: Function, setIsLoading: Function) =>
  () => {
    if (canvasInstanceRef.current) {
      setIsLoading(true); // Ustaw flagę isLoading na true
      canvasInstanceRef.current.clear();
      setObjects([]); // Resetuj stan obiektów
      localStorage.removeItem("objects"); // Usuń obiekty z localStorage
      canvasInstanceRef.current.renderAll(); // Dodajemy to, aby wymusić renderowanie
      setIsLoading(false); // Ustaw flagę isLoading na false po zakończeniu resetowania
    }
  };