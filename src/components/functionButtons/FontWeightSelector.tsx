"use client";
// FontWeightSelector.tsx
import useCanvas from "@/context/CanvasContext";

const FontWeightSelector = () => {
    const { fontWeight, setFontWeight } = useCanvas();
    const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFontWeight && setFontWeight(e.target.value);
    };
    return (
        <label>
            Grubość czcionki:
            <select value={fontWeight} onChange={handleFontWeightChange}>
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
                <option value="lighter">Lighter</option>
            </select>
        </label>
    );
};

export default FontWeightSelector;