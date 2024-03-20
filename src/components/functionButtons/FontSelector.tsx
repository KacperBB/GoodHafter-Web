"use client";
// FontSelector.tsx
import useCanvas from "@/context/CanvasContext";

const FontSelector = () => {
    const { selectedFont, setSelectedFont } = useCanvas();
    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFont && setSelectedFont(e.target.value);
    };
    return (
        <label>
            Wybierz czcionkę:
            <select value={selectedFont} onChange={handleFontChange}>
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
            </select>
        </label>
    );
};

export default FontSelector;