import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const DownloadCanvasButton = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('DownloadCanvasButton musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { downloadCanvas } = canvasContext;

    return <button onClick={downloadCanvas}>Pobierz obraz</button>;
};

export default DownloadCanvasButton;