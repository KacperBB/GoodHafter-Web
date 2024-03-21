// FontSelector.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontSelector = () => {
    const { selectedFont, setSelectedFont, handleFontChange } = useCanvas();


    return (
        <label>
            Wybierz czcionkę:
            <select value={selectedFont} onChange={handleFontChange}>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
            </select>
        </label>
    );
};

export default FontSelector;