'use client'

import { fabric } from "fabric";
import { debounce } from "lodash";
import shirtDesignConfig from "../lib/clothConfig";

// Define types for editable area and fabric object
interface EditableArea {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface FabricObject extends fabric.Object {
  original?: {
    left: number;
    top: number;
    scaleX: number;
    scaleY: number;
  };
  previous?: {
    scaleX: number;
    scaleY: number;
    left: number;
    top: number;
  };
}

// Function to add event handlers to canvas
export const addCanvasEventHandlers = (
  fabricCanvas: fabric.Canvas,
  imageSize: { width: number; height: number }
) => {
  // Remove existing event listeners
  fabricCanvas.off("object:scaling object:moving");
  fabricCanvas.off("object:modified");

  // Find editable area configuration
  const editableAreaConfig = shirtDesignConfig.editableAreas.find(
    (area) => area.id === "front"
  );

  let editableArea: EditableArea | null = null;

  // If editable area configuration exists and image size is available
  if (editableAreaConfig && imageSize.width && imageSize.height) {
    editableArea = {
      top: imageSize.height * editableAreaConfig.top,
      left: imageSize.width * editableAreaConfig.left,
      width: imageSize.width * editableAreaConfig.width,
      height: imageSize.height * editableAreaConfig.height,
    };
  }

  // Event handler for object scaling and moving
  fabricCanvas.on("object:scaling object:moving", function (event: fabric.IEvent) {
    const obj = event.target as FabricObject;

    // Log current position of the object
    console.log(
      `Object moved. Current position: left = ${obj.left}, top = ${obj.top}`
    );

    // If editable area is defined
    if (editableArea) {
      const newScaleX = Math.min(
        obj.scaleX ?? 1,
        editableArea.width / (obj.width ?? 1)
      );
      const newScaleY = Math.min(
        obj.scaleY ?? 1,
        editableArea.height / (obj.height ?? 1)
      );
      obj.set({
        scaleX: newScaleX,
        scaleY: newScaleY,
        left: Math.min(
          Math.max(
            obj.left ?? 0,
            editableArea.left + ((obj.width ?? 1) * newScaleX) / 2
          ),
          editableArea.left +
            editableArea.width -
            ((obj.width ?? 1) * newScaleX) / 2
        ),
        top: Math.min(
          Math.max(
            obj.top ?? 0,
            editableArea.top + ((obj.height ?? 1) * newScaleY) / 2
          ),
          editableArea.top +
            editableArea.height -
            ((obj.height ?? 1) * newScaleY) / 2
        ),
      });
      obj.setCoords(); // Update object coordinates after moving or scaling
      fabricCanvas.renderAll(); // Immediately update canvas view
    }
  });

  // Limit object movement to specified area
  fabricCanvas.on(
    "object:modified",
    debounce(function (event: fabric.IEvent) {
      const obj = event.target as FabricObject;

      const editableAreaConfig = shirtDesignConfig.editableAreas.find(
        (area) => area.id === "front"
      );

      // If editable area configuration exists and canvas dimensions are available
      if (editableAreaConfig && fabricCanvas.width && fabricCanvas.height) {
        const editableArea: EditableArea = {
          top: fabricCanvas.height * editableAreaConfig.top,
          left: fabricCanvas.width * editableAreaConfig.left,
          width: fabricCanvas.width * editableAreaConfig.width,
          height: fabricCanvas.height * editableAreaConfig.height,
        };

        const newScaleX = Math.min(
          obj.scaleX ?? 1,
          editableArea.width / (obj.width ?? 1)
        );
        const newScaleY = Math.min(
          obj.scaleY ?? 1,
          editableArea.height / (obj.height ?? 1)
        );
        obj.set({
          scaleX: newScaleX,
          scaleY: newScaleY,
          left: Math.min(
            Math.max(
              obj.left ?? 0,
              editableArea.left + ((obj.width ?? 1) * newScaleX) / 2
            ),
            editableArea.left +
              editableArea.width -
              ((obj.width ?? 1) * newScaleX) / 2
          ),
          top: Math.min(
            Math.max(
              obj.top ?? 0,
              editableArea.top + ((obj.height ?? 1) * newScaleY) / 2
            ),
            editableArea.top +
              editableArea.height -
              ((obj.height ?? 1) * newScaleY) / 2
          ),
        });
        obj.setCoords(); // Update object coordinates after moving or scaling
        fabricCanvas.renderAll(); // Immediately update canvas view

        // Serialize canvas state and save to local storage
        const canvasState = fabricCanvas.toJSON(["name"]);
        localStorage.setItem("canvasState", JSON.stringify(canvasState));
      }
    }, 100) // Set debounce time to 100ms
  );
};
