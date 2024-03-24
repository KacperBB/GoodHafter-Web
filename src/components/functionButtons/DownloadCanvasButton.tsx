import { useCanvas } from '@/context/CanvasContext';
import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

const DownloadCanvasButton = () => {
    const canvasContext = useCanvas();

    if (!canvasContext) {
        console.error('DownloadCanvasButton musi być używany wewnątrz CanvasProvider');
        return null; // lub inna obsługa błędu
    }

    const { downloadCanvas } = canvasContext;

    return <Button onClick={downloadCanvas} variant='outline' className='w-fit h-auto aspect-square shadow-aesthetic p-2 text-muted-foreground'>
        <Download className='p-1' />
    </Button>;
};

export default DownloadCanvasButton;