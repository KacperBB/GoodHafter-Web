// TextUpdateLogic.tsx
import { fabric } from "fabric";
import { ITextExtended } from "./CanvasTypes";

export const updateTextOnCanvas = (canvas: fabric.Canvas, textObject: fabric.IText, textProps: fabric.ITextOptions) => {
    textObject.set(textProps);
    canvas.renderAll();
};

export const updateTextOnServer = async (selectedObject: ITextExtended) => {
    const response = await fetch("/api/update-text", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: selectedObject.id,
            text: selectedObject.text,
            fontSize: selectedObject.fontSize,
            fontFamily: selectedObject.fontFamily,
            fontWeight: selectedObject.fontWeight,
            fill: selectedObject.fill,
        }),
    });

    if (!response.ok) {
        console.error("Failed to update text on server");
    }
};