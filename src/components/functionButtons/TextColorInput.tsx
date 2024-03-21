import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const TextColorInput = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('TextColorInput musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { textColor, setTextColor } = canvasContext;

    const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextColor && setTextColor(e.target.value);
    };

    return (
        <label>
            Kolor tekstu:
            <input type="color" value={textColor} onChange={handleTextColorChange} />
        </label>
    );
};

export default TextColorInput;