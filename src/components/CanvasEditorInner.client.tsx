'use client'
// CanvasEditor.tsx
import useCanvas from "@/context/CanvasContext";
import { useEffect, useState } from 'react';

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
    fontSize,
    setFontSize,
    fontWeight,
    setFontWeight,
    textColor,
    setTextColor,
    addText,
    canvas,
  } = canvasContext || {};

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFont && setSelectedFont(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === 'i-text') {
      activeObject.set({ fontFamily: e.target.value });
      canvas?.renderAll();
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize && setFontSize(Number(e.target.value));
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === 'i-text') {
      activeObject.set({ fontSize: Number(e.target.value) });
      canvas?.renderAll();
    }
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontWeight && setFontWeight(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === 'i-text') {
      activeObject.set({ fontWeight: e.target.value });
      canvas?.renderAll();
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor && setTextColor(e.target.value);
    const activeObject = canvas?.getActiveObject() as fabric.IText;
    if (activeObject?.type === 'i-text') {
      activeObject.set({ fill: e.target.value });
      canvas?.renderAll();
    }
  };

  return isClient ? (
    <div>
      <div className="mt-4">
        <select value={selectedFont} onChange={handleFontChange}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>
        <input type="number" value={fontSize} onChange={handleFontSizeChange} />
        <select value={fontWeight} onChange={handleFontWeightChange}>
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Lighter</option>
        </select>
        <input type="color" value={textColor} onChange={handleTextColorChange} />
        <button onClick={addText}>Dodaj tekst</button>
      </div>
    </div>
  ) : null;
};

export default CanvasEditor;