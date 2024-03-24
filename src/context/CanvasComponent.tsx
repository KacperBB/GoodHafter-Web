'use client'

// CanvasComponent.tsx
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useCanvas } from './CanvasContext';

const CanvasComponent = () => {
    const { canvasInstanceRef, setCanvasInstanceRef, setObjects } = useCanvas();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasRef.current && !canvasInstanceRef) {
            const fabricCanvas = new fabric.Canvas(canvasRef.current);
            setCanvasInstanceRef(fabricCanvas);
            console.log("Fabric canvas initialized", fabricCanvas);

            // Usuń dodatkowy element canvas
            const upperCanvases = document.querySelectorAll(".upper-canvas");
            if (upperCanvases.length > 1) {
                upperCanvases[1].parentNode?.removeChild(upperCanvases[1]);
            }

            // Przywróć stan obiektów na płótnie
            const savedCanvasState = localStorage.getItem('canvasState');
            if (savedCanvasState) {
                fabricCanvas.loadFromJSON(savedCanvasState, () => {
                    fabricCanvas.renderAll();
                    setObjects(fabricCanvas.getObjects()); // Aktualizujemy stan objects po załadowaniu stanu płótna
                });
            }
        }

        // Zapisz stan obiektów na płótnie przed unmount
        return () => {
            if (canvasInstanceRef) {
                const canvasState = canvasInstanceRef.toJSON(['name']); // Dodajemy 'name' do listy właściwości do serializacji
                localStorage.setItem('canvasState', JSON.stringify(canvasState));
            }
        };
    }, [setCanvasInstanceRef, canvasInstanceRef, setObjects]);

    useEffect(() => {
        const resizeCanvas = () => {
            if (canvasRef.current && canvasInstanceRef) {
                const parentElement = canvasRef.current.parentElement;
                if (parentElement) {
                    canvasInstanceRef.setWidth(parentElement.offsetWidth);
                    canvasInstanceRef.setHeight(parentElement.offsetHeight);
                    canvasInstanceRef.calcOffset();
                    canvasInstanceRef.renderAll();
                }
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [canvasInstanceRef]);

    return( 
        <div className='border-[1px] w-full h-full border-gray rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]'>
            <canvas ref={canvasRef} id="canvas" />
        </div>
    );
};

export default CanvasComponent;