import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const TextColorInput = () => {
    const canvasContext = useCanvas();

    const { textColor, handleColorChange } = canvasContext;

    return (
        <label>
            Kolor tekstu:
            <input type="color" value={textColor} onChange={handleColorChange} />
        </label>
    );
};

export default TextColorInput;