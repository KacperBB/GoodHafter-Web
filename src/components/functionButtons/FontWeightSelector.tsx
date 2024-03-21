import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontWeightSelector = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('FontWeightSelector musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { fontWeight, setFontWeight } = canvasContext;

    const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFontWeight && setFontWeight(e.target.value);
    };

    return (
        <label>
            Grubość czcionki:
            <select value={fontWeight} onChange={handleFontWeightChange}>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
            </select>
        </label>
    );
};

export default FontWeightSelector;