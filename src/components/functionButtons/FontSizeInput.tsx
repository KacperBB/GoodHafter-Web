// FontSizeInput.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontSizeInput = () => {
    const { fontSize, handleFontSizeChange } = useCanvas(); // Użyj handleFontSizeChange zamiast setFontSize

    return (
        <label>
            Rozmiar czcionki:
            <input type="number" value={fontSize} onChange={handleFontSizeChange} />
        </label>
    );
};

export default FontSizeInput;