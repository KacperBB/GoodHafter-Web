"use client";
// DownloadCanvasButton.tsx
import useCanvas from "@/context/CanvasContext";

const DownloadCanvasButton = () => {
    const { downloadCanvas } = useCanvas();
    return <button onClick={downloadCanvas}>Pobierz obraz</button>;
};

export default DownloadCanvasButton;