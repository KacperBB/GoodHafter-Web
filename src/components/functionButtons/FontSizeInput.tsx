"use client";
// FontSizeInput.tsx
import useCanvas from "@/context/CanvasContext";

const FontSizeInput = () => {
    const { fontSize, setFontSize } = useCanvas();
    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFontSize && setFontSize(Number(e.target.value));
    };
    return (
        <label>
            Rozmiar czcionki:
            <input type="number" value={fontSize} onChange={handleFontSizeChange} />
        </label>
    );
};

export default FontSizeInput;