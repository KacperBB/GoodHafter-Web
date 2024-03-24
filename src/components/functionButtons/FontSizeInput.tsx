// FontSizeInput.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const FontSizeInput = () => {
    const { fontSize, handleFontSizeChange } = useCanvas(); // Użyj handleFontSizeChange zamiast setFontSize

    return (
        <div>
            <Input type="number" value={fontSize} onChange={handleFontSizeChange} className='max-w-[150px]'/>
        </div>
    );
};

export default FontSizeInput;