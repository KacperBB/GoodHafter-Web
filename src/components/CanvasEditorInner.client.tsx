"use client";
// CanvasEditor.tsx
import useCanvas from "@/context/CanvasContext";
import { useEffect, useState } from "react";
import AddTextButton from "./functionButtons/AddTextButton";
import DeleteSelectedButton from "./functionButtons/DeleteSelectedButton";
import ResetCanvasButton from "./functionButtons/ResetCanvasButton";
import DownloadCanvasButton from "./functionButtons/DownloadCanvasButton";
import FontSelector from "./functionButtons/FontSelector";
import FontSizeInput from "./functionButtons/FontSizeInput";
import TextColorInput from "./functionButtons/TextColorInput";
import FontWeightSelector from "./functionButtons/FontWeightSelector";
import AddImageButton from "./functionButtons/AddImageButton";

const CanvasEditor = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const canvasContext = useCanvas();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    selectedFont,
    setSelectedFont,
    downloadCanvas,
    fontSize,
    setFontSize,
    fontWeight,
    setFontWeight,
    textColor,
    addImage,
    setTextColor,
    addText,
    canvas,
    deleteSelected,
    resetCanvas,
  } = canvasContext || {};

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont && setSelectedFont(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === "i-text") {
      activeObject.set({ fontFamily: e.target.value });
      canvas?.renderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize && setFontSize(Number(e.target.value));
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === "i-text") {
      activeObject.set({ fontSize: Number(e.target.value) });
      canvas?.renderAll();
    }
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontWeight && setFontWeight(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === "i-text") {
      activeObject.set({ fontWeight: e.target.value });
      canvas?.renderAll();
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor && setTextColor(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === "i-text") {
      activeObject.set({ fill: e.target.value });
      canvas?.renderAll();
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = function (event) {
      if (event.target) {
    addImage && addImage(event.target.result as string);
    }
    };
    if (file) {
    reader.readAsDataURL(file);
  }
  };

  return isClient ? (
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
  ) : null;
};

export default CanvasEditor;
