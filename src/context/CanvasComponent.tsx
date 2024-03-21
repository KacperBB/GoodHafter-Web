'use client'

// CanvasComponent.tsx
import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { useCanvas } from './CanvasContext';

const CanvasComponent = () => {
    const { canvasInstanceRef, setCanvasInstanceRef } = useCanvas();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (canvasRef.current && !canvasInstanceRef && !isInitialized) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                height: 400,
                width: 600,
                selection: true,
            });
            console.log('initCanvas', initCanvas);
            setCanvasInstanceRef(initCanvas);
            setIsInitialized(true);
        }

        // Cleanup na unmount
        return () => {
            setCanvasInstanceRef(null);
        };
    }, [setCanvasInstanceRef, isInitialized]);

    return <canvas ref={canvasRef} id="canvas" />;
};

export default CanvasComponent;