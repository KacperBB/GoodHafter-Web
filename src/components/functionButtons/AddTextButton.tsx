"use client";
// AddTextButton.tsx
import useCanvas from "@/context/CanvasContext";

const AddTextButton = () => {
    const { addText } = useCanvas();
    return <button onClick={addText}>Dodaj tekst</button>;
};

export default AddTextButton;