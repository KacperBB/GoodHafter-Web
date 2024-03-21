import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontSizeInput = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('FontSizeInput musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { fontSize, setFontSize } = canvasContext;

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFontSize && setFontSize(Number(e.target.value));
    };

    return (
        <label>
            Rozmiar czcionki:
            <input type="number" value={fontSize} onChange={handleFontSizeChange} />
        </label>
    );
};

export default FontSizeInput;