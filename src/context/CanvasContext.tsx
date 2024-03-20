'use client'
// CanvasContext.tsx
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasContextProps {
    canvas: fabric.Canvas | null;
    selectedFont: string;
    setSelectedFont: React.Dispatch<React.SetStateAction<string>>;
    fontSize: number;
    setFontSize: React.Dispatch<React.SetStateAction<number>>;
    fontWeight: string;
    setFontWeight: React.Dispatch<React.SetStateAction<string>>;
    textColor: string;
    setTextColor: React.Dispatch<React.SetStateAction<string>>;
    addText: () => void;
}

export const CanvasContext = createContext<CanvasContextProps | undefined>(undefined);

export const CanvasProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasInstanceRef = useRef<fabric.Canvas | null>(null);
    const [selectedFont, setSelectedFont] = useState('Arial');
    const [fontSize, setFontSize] = useState(20);
    const [fontWeight, setFontWeight] = useState('normal');
    const [textColor, setTextColor] = useState('#ffffff');

    useEffect(() => {
        if (canvasRef.current && !canvasInstanceRef.current) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                height: 400,
                width: 600,
                selection: true,
            });
            canvasInstanceRef.current = initCanvas;
        }
    }, []);

    const addText = () => {
        const text = new fabric.IText('Twój tekst', {
            left: 50,
            top: 50,
            fontSize: fontSize,
            fontFamily: selectedFont,
            fontWeight: fontWeight,
            fill: textColor,
            selectable: true,
            hasControls: true,
        });

        text.on('mouse:dblclick', () => {
            text.enterEditing();
        });

        canvasInstanceRef.current?.add(text);
        canvasInstanceRef.current?.setActiveObject(text);
        canvasInstanceRef.current?.requestRenderAll();
    };

    return (
        <CanvasContext.Provider
            value={{
                canvas: canvasInstanceRef.current,
                selectedFont,
                setSelectedFont,
                fontSize,
                setFontSize,
                fontWeight,
                setFontWeight,
                textColor,
                setTextColor,
                addText,
            }}
        >
            <canvas ref={canvasRef} />
            {children}
        </CanvasContext.Provider>
    );
};

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (context === undefined) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
};


export default useCanvas;