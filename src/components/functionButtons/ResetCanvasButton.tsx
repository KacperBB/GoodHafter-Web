"use client";
// ResetCanvasButton.tsx
import useCanvas from "@/context/CanvasContext";

const ResetCanvasButton = () => {
    const { resetCanvas } = useCanvas();
    return <button onClick={resetCanvas}>Resetuj płótno</button>;
};

export default ResetCanvasButton;