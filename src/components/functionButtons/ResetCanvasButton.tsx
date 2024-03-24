import { useCanvas } from "@/context/CanvasContext";
import React from "react";
import { Button } from "../ui/button";
import { RotateCcw } from "lucide-react";

const ResetCanvasButton = () => {
  const canvasContext = useCanvas();

  if (!canvasContext) {
    console.error("ResetCanvasButton musi być używany wewnątrz CanvasProvider");
    return null; // lub inna obsługa błędu
  }

  const { resetCanvas } = canvasContext;

  return (
    <Button onClick={resetCanvas} variant='outline' className='w-fit h-auto aspect-square shadow-aesthetic p-2 text-muted-foreground'>
      <RotateCcw className='p-1' />
    </Button>
  );
};

export default ResetCanvasButton;
