// FontWeightSelector.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const FontWeightSelector = () => {
    const { fontWeight, handleFontWeightChange } = useCanvas();

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