// AddTextButton.js
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';


const AddTextButton = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('AddTextButton musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { addText } = canvasContext;

    return <button onClick={addText}>Dodaj tekst</button>;
};

export default AddTextButton;
