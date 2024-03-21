import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontSelector = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('FontSelector musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { selectedFont, setSelectedFont } = canvasContext;

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFont && setSelectedFont(e.target.value);
    };

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