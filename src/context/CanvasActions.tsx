// CanvasActions.tsx
import { fabric } from "fabric";

export const addText = (canvas: fabric.Canvas, textProps: fabric.ITextOptions) => {
    const text = new fabric.IText("Twój tekst", textProps);

    text.on("mouse:dblclick", () => {
        text.enterEditing();
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.requestRenderAll();
};

export const addImage = (canvas: fabric.Canvas, url: string) => {
    fabric.Image.fromURL(url, function (img) {
        if (img) {
            img.set({
                left: 50,
                top: 50,
                selectable: true,
                hasControls: true,
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
        }
    });
};

export const deleteSelected = (canvas: fabric.Canvas) => {
    const activeObjects = canvas.getActiveObjects();
    canvas.remove(...activeObjects);
};

export const resetCanvas = (canvas: fabric.Canvas) => {
    canvas.clear();
};