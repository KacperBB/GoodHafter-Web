'use client'

import AddTextButton from "./functionButtons/AddTextButton";
import DeleteSelectedButton from "./functionButtons/DeleteSelectedButton";
import ResetCanvasButton from "./functionButtons/ResetCanvasButton";
import DownloadCanvasButton from "./functionButtons/DownloadCanvasButton";
import FontSelector from "./functionButtons/FontSelector";
import FontSizeInput from "./functionButtons/FontSizeInput";
import TextColorInput from "./functionButtons/TextColorInput";
import FontWeightSelector from "./functionButtons/FontWeightSelector";
import AddImageButton from "./functionButtons/AddImageButton";
import { useCanvas } from "../context/CanvasContext";

const CanvasEditor = () => {
  const canvasContext = useCanvas();

  if (!canvasContext) {
    console.error('CanvasEditor musi być używany wewnątrz CanvasProvider');
    return null; // lub inna obsługa błędu
  }

  return (
    <div>
        <AddTextButton />
        <DeleteSelectedButton />
        <ResetCanvasButton />
        <DownloadCanvasButton />
        <FontSelector />
        <FontSizeInput />
        <FontWeightSelector />
        <TextColorInput />
        <AddImageButton />
    </div>
  );
};

export default CanvasEditor;