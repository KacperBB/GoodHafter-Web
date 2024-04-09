'use client'

// Import necessary modules and types
import { fabric } from "fabric";
import shirtDesignConfig from "../lib/clothConfig";

// Define type for editable area
interface EditableArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

// Function to resize canvas and draw editable area border lines
export const resizeCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasInstanceRef: fabric.Canvas | null | undefined
) => {
  if (canvasRef.current && canvasInstanceRef) {
    const parentElement = canvasRef.current.parentElement;
    if (parentElement) {
      const width = parentElement.offsetWidth;
      const height = parentElement.offsetHeight;
      canvasInstanceRef.setWidth(width);
      canvasInstanceRef.setHeight(height);
      canvasInstanceRef.calcOffset();

      // Retrieve editable area dimensions from configuration
      const borderTop = shirtDesignConfig.editableAreas[0].top;
      const borderLeft = shirtDesignConfig.editableAreas[0].left;
      const borderWidth = shirtDesignConfig.editableAreas[0].width;
      const borderHeight = shirtDesignConfig.editableAreas[0].height;

      // Remove existing lines (if any)
      const objectsToRemove: fabric.Object[] = [];
      canvasInstanceRef.getObjects("line").forEach((o) => {
        if (o.strokeDashArray && o.strokeDashArray[0] === 5) {
          objectsToRemove.push(o);
        }
      });
      objectsToRemove.forEach((obj) => {
        canvasInstanceRef.remove(obj);
      });

      // Define editable area
      const editableArea: EditableArea = {
        top: height * borderTop,
        left: width * borderLeft,
        width: width * borderWidth,
        height: height * borderHeight,
      };

      // Create dashed lines for each side of the rectangle
      const lines = [
        new fabric.Line(
          [
            editableArea.left,
            editableArea.top,
            editableArea.left + editableArea.width,
            editableArea.top,
          ],
          {
            stroke: "#000000",
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          }
        ),
        new fabric.Line(
          [
            editableArea.left,
            editableArea.top,
            editableArea.left,
            editableArea.top + editableArea.height,
          ],
          {
            stroke: "#000000",
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false, // Lines cannot be selected
            evented: false,
          }
        ),
        new fabric.Line(
          [
            editableArea.left,
            editableArea.top + editableArea.height,
            editableArea.left + editableArea.width,
            editableArea.top + editableArea.height,
          ],
          {
            stroke: "#000000",
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          }
        ),
        new fabric.Line(
          [
            editableArea.left + editableArea.width,
            editableArea.top,
            editableArea.left + editableArea.width,
            editableArea.top + editableArea.height,
          ],
          {
            stroke: "#000000",
            strokeWidth: 1,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          }
        ),
      ];

      // Add dashed lines to canvas
      lines.forEach((line) => canvasInstanceRef.add(line));

      canvasInstanceRef.renderAll(); // Render canvas
    }
  }
};
