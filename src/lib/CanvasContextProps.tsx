import { fabric } from "fabric";
import { Dispatch, SetStateAction } from "react";

export interface CanvasContextProps {
  selectedFont: string;
  setSelectedFont: Dispatch<SetStateAction<string>>;
  fontSize: number;
  setFontSize: Dispatch<SetStateAction<number>>;
  fontWeight: string;
  setFontWeight: Dispatch<SetStateAction<string>>;
  textColor: string;
  setTextColor: Dispatch<SetStateAction<string>>;
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
  canvasInstanceRef?: fabric.Canvas | null;
  objects: fabric.Object[];
  setObjects: Dispatch<SetStateAction<fabric.Object[]>>;
  moveObject: (direction: "up" | "down", index: number) => void;
}