import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const ResetCanvasButton = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('ResetCanvasButton musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { resetCanvas } = canvasContext;

    return <button onClick={resetCanvas}>Resetuj płótno</button>;
};

export default ResetCanvasButton;