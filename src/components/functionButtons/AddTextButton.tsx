// AddTextButton.js
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';
import { Button } from '../ui/button';


const AddTextButton = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('AddTextButton musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { addText } = canvasContext;

    return <Button onClick={addText} variant='outline' className='text-muted-foreground max-w-[150px] shadow-aesthetic'>Add Text</Button>;
};

export default AddTextButton;
