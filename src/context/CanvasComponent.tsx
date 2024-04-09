"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "./CanvasContext";
import shirtDesignConfig from "../lib/clothConfig";

const CanvasComponent = () => {
  const { canvasInstanceRef, setCanvasInstanceRef, setObjects } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current && !canvasInstanceRef) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      setCanvasInstanceRef(fabricCanvas);
      console.log("Inicjalizacja płótna Fabric", fabricCanvas);

      fabric.Image.fromURL(shirtDesignConfig.imageUrl, (img) => {
        const scaleX = fabricCanvas.getWidth() / img.getScaledWidth();
        const scaleY = fabricCanvas.getHeight() / img.getScaledHeight();
        const left = fabricCanvas.getWidth() / 2;
        const top = fabricCanvas.getHeight() / 2;

        fabricCanvas.setBackgroundImage(
          img,
          () => {
            fabricCanvas.renderAll();

            const area = shirtDesignConfig.editableAreas.find(
              (area) => area.id === "front"
            );
            if (area) {
              const editableArea = new fabric.Rect({
                left: area.left * fabricCanvas.getWidth(),
                top: area.top * fabricCanvas.getHeight(),
                width: area.width * fabricCanvas.getWidth(),
                height: area.height * fabricCanvas.getHeight(),
                stroke: "red",
                strokeWidth: 2,
                fill: "transparent",
                selectable: false,
                strokeDashArray: [5, 5],
                originX: "left",
                originY: "top",
              });
              fabricCanvas.add(editableArea);
            }
          },
          {
            scaleX: scaleX,
            scaleY: scaleY,
            left: left,
            top: top,
            originX: "center",
            originY: "center",
          }
        );
      });

      let previousScaleX = 1;
      let previousScaleY = 1;
      let previousAngle = 0;
const MARGIN = 10; // Add this line

fabricCanvas.on("object:moving", (e) => {
  const obj = e.target as fabric.Object; // Type assertion here
  const area = shirtDesignConfig.editableAreas.find(
    (area) => area.id === "front"
  );
  if (obj && area) {
    const areaLeft = area.left * fabricCanvas.getWidth() + MARGIN;
    const areaTop = area.top * fabricCanvas.getHeight() + MARGIN;
    const areaRight = areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
    const areaBottom = areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

    const boundingRect = obj.getBoundingRect(true);

    if (
      boundingRect.left < areaLeft ||
      boundingRect.top < areaTop ||
      boundingRect.left + boundingRect.width > areaRight ||
      boundingRect.top + boundingRect.height > areaBottom
    ) {
      const newLeft = obj.left !== undefined ? Math.min(
        Math.max(obj.left, areaLeft + boundingRect.width / 2),
        areaRight - boundingRect.width / 2
      ) : areaLeft;
      const newTop = obj.top !== undefined ? Math.min(
        Math.max(obj.top, areaTop + boundingRect.height / 2),
        areaBottom - boundingRect.height / 2
      ) : areaTop;
      obj.set({ left: newLeft, top: newTop }).setCoords();
    }
  }
});

fabricCanvas.on("object:rotating", (e) => {
  const obj = e.target as fabric.Object; // Type assertion here
  const area = shirtDesignConfig.editableAreas.find(
    (area) => area.id === "front"
  );
  if (obj && area) {
    const areaLeft = area.left * fabricCanvas.getWidth() + MARGIN;
    const areaTop = area.top * fabricCanvas.getHeight() + MARGIN;
    const areaRight = areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
    const areaBottom = areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

    const boundingRect = obj.getBoundingRect(true);

    if (
      boundingRect.left < areaLeft ||
      boundingRect.top < areaTop ||
      boundingRect.left + boundingRect.width > areaRight ||
      boundingRect.top + boundingRect.height > areaBottom
    ) {
      if (obj.angle !== undefined) {
        obj.angle = previousAngle;
      }
    }

    previousAngle = obj.angle !== undefined ? obj.angle : previousAngle;
  }
});

      fabricCanvas.on("object:scaling", (e) => {
        const obj = e.target as fabric.Object; // Type assertion here
        const area = shirtDesignConfig.editableAreas.find(
          (area) => area.id === "front"
        );
        if (obj && area) {
          const areaWidth = area.width * fabricCanvas.getWidth();
          const areaHeight = area.height * fabricCanvas.getHeight();

          if (obj.getScaledWidth() > areaWidth && obj.scaleX > previousScaleX) {
            obj.scaleX = previousScaleX;
          }
          if (
            obj.getScaledHeight() > areaHeight &&
            obj.scaleY > previousScaleY
          ) {
            obj.scaleY = previousScaleY;
          }

          previousScaleX = obj.scaleX;
          previousScaleY = obj.scaleY;
        }
      });

      fabricCanvas.on("object:modified", (e) => {
        const obj = e.target as fabric.Object; // Type assertion here
        const area = shirtDesignConfig.editableAreas.find(
          (area) => area.id === "front"
        );
        if (obj && area && obj.scaleX && obj.scaleY && obj.left && obj.top) {
          const areaWidth = area.width * fabricCanvas.getWidth();
          const areaHeight = area.height * fabricCanvas.getHeight();
          const areaLeft = area.left * fabricCanvas.getWidth();
          const areaTop = area.top * fabricCanvas.getHeight();
          const areaRight = areaLeft + areaWidth;
          const areaBottom = areaTop + areaHeight;

          if (
            obj.getScaledWidth() > areaWidth &&
            obj.scaleX >= previousScaleX
          ) {
            obj.scaleX = areaWidth / obj.width;
            obj.lockScalingX = obj.scaleX >= previousScaleX; // Lock scaling up in the X direction
          } else {
            obj.lockScalingX = false; // Unlock scaling in the X direction
          }
          if (
            obj.getScaledHeight() > areaHeight &&
            obj.scaleY >= previousScaleY
          ) {
            obj.scaleY = areaHeight / obj.height;
            obj.lockScalingY = obj.scaleY >= previousScaleY; // Lock scaling up in the Y direction
          } else {
            obj.lockScalingY = false; // Unlock scaling in the Y direction
          }

          const objLeft = obj.left;
          const objTop = obj.top;

          if (
            objLeft - obj.getScaledWidth() / 2 < areaLeft ||
            objTop - obj.getScaledHeight() / 2 < areaTop ||
            objLeft + obj.getScaledWidth() / 2 > areaRight ||
            objTop + obj.getScaledHeight() / 2 > areaBottom
          ) {
            obj
              .set({
                left: Math.min(
                  Math.max(objLeft, areaLeft + obj.getScaledWidth() / 2),
                  areaRight - obj.getScaledWidth() / 2
                ),
                top: Math.min(
                  Math.max(objTop, areaTop + obj.getScaledHeight() / 2),
                  areaBottom - obj.getScaledHeight() / 2
                ),
              })
              .setCoords();
          }
        }
      });

      const upperCanvases = document.querySelectorAll(".upper-canvas");
      if (upperCanvases.length > 1) {
        upperCanvases[1].parentNode?.removeChild(upperCanvases[1]);
      }

      const savedCanvasState = localStorage.getItem("canvasState");
      if (savedCanvasState) {
        fabricCanvas.loadFromJSON(savedCanvasState, () => {
          fabricCanvas.renderAll();
          setObjects(fabricCanvas.getObjects());
        });
      }
    }
  }, [setCanvasInstanceRef, canvasInstanceRef, setObjects]);

  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && canvasInstanceRef) {
        const parentElement = canvasRef.current.parentElement;
        if (parentElement) {
          canvasInstanceRef.setWidth(parentElement.offsetWidth);
          canvasInstanceRef.setHeight(parentElement.offsetHeight);
          canvasInstanceRef.calcOffset();
          canvasInstanceRef.renderAll();
        }
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasInstanceRef]);

  return (
    <div className="border-[1px] w-full h-full border-gray rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
      <canvas ref={canvasRef} id="canvas" />
    </div>
  );
};

export default CanvasComponent;
