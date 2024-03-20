"use client";
// TextColorInput.tsx
import useCanvas from "@/context/CanvasContext";

const TextColorInput = () => {
    const { textColor, setTextColor } = useCanvas();
    const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextColor && setTextColor(e.target.value);
    };
    return (
        <label>
            Kolor tekstu:
            <input type="color" value={textColor} onChange={handleTextColorChange} />
        </label>
    );
};

export default TextColorInput;