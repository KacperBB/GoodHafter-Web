"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useCanvas } from "../../context/CanvasContext";
import shirtDesignConfig from "../../lib/clothConfig";

const CanvasComponent = () => {
  const { canvasInstanceRef, setCanvasInstanceRef, setObjects } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  //Initialization of Editable Area

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
                excludeFromNavigator: true,
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
      const MARGIN = 5; // Add this line
      let isOutOfBounds = false;
      let previousPosition = { left: 0, top: 0 };
      let previousLeft = 0;
      let previousTop = 0;

      fabricCanvas.on("object:moving", (e) => {
        const obj = e.target as fabric.Object; // Type assertion here
        const area = shirtDesignConfig.editableAreas.find(
          (area) => area.id === "front"
        );
        if (obj && area) {
          const areaLeft = area.left * fabricCanvas.getWidth() + MARGIN;
          const areaTop = area.top * fabricCanvas.getHeight() + MARGIN;
          const areaRight =
            areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
          const areaBottom =
            areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

          const boundingRect = obj.getBoundingRect(true);

          if (
            boundingRect.left < areaLeft ||
            boundingRect.top < areaTop ||
            boundingRect.left + boundingRect.width > areaRight ||
            boundingRect.top + boundingRect.height > areaBottom
          ) {
            isOutOfBounds = true;
          } else {
            isOutOfBounds = false;
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
    const areaRight =
      areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
    const areaBottom =
      areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

    obj.set({
      originX: 'center',
      originY: 'center',
    });

    const boundingRect = obj.getBoundingRect(true);

    if (
      boundingRect.left < areaLeft ||
      boundingRect.top < areaTop ||
      boundingRect.left + boundingRect.width > areaRight ||
      boundingRect.top + boundingRect.height > areaBottom
    ) {
      isOutOfBounds = true;

      // Calculate the maximum scale that the object can have to fit within the area
      const maxScaleX = obj.width
        ? (areaRight - areaLeft) / obj.width
        : 1;
      const maxScaleY = obj.height
        ? (areaBottom - areaTop) / obj.height
        : 1;
      const maxScale = Math.min(maxScaleX, maxScaleY);

      // Set the object's scale to the maximum scale
      obj.set({
        scaleX: maxScale,
        scaleY: maxScale,
      });

      // Force the canvas to re-render
      fabricCanvas.renderAll();
    } else {
      isOutOfBounds = false;
    }

    obj.set({
      originX: 'left',
      originY: 'top',
    });
  }
});

fabricCanvas.on("object:scaling", (e) => {
  const obj = e.target as any;
  const area = shirtDesignConfig.editableAreas.find(
    (area) => area.id === "front"
  );
  if (obj && area) {
    const areaLeft = area.left * fabricCanvas.getWidth() + MARGIN;
    const areaTop = area.top * fabricCanvas.getHeight() + MARGIN;
    const areaRight =
      areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
    const areaBottom =
      areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

    const objectCorners = obj.getBoundingRect();

    const collisionLeft = objectCorners.left < areaLeft;
    const collisionTop = objectCorners.top < areaTop;
    const collisionRight = objectCorners.left + objectCorners.width > areaRight;
    const collisionBottom = objectCorners.top + objectCorners.height > areaBottom;

    const scalingDownX = (obj.scaleX || 1) < previousScaleX;
    const scalingDownY = (obj.scaleY || 1) < previousScaleY;

    if (collisionLeft && !scalingDownX) {
      obj.set({
        scaleX: previousScaleX,
        left: previousLeft,
      });
    }

    if (collisionTop && !scalingDownY) {
      obj.set({
        scaleY: previousScaleY,
        top: previousTop,
      });
    }

    if (collisionRight && !scalingDownX) {
      obj.set({
        scaleX: previousScaleX,
        left: previousLeft,
      });
    }

    if (collisionBottom && !scalingDownY) {
      obj.set({
        scaleY: previousScaleY,
        top: previousTop,
      });
    }

    previousScaleX = obj.scaleX || 1;
    previousScaleY = obj.scaleY || 1;
    previousLeft = obj.left;
    previousTop = obj.top;
  }
});

      fabricCanvas.on("object:modified", (e) => {
        const obj = e.target as fabric.Object; // Type assertion here
        const area = shirtDesignConfig.editableAreas.find(
          (area) => area.id === "front"
        );
        if (obj && area && isOutOfBounds) {
          const areaLeft = area.left * fabricCanvas.getWidth() + MARGIN;
          const areaTop = area.top * fabricCanvas.getHeight() + MARGIN;
          const areaRight =
            areaLeft + area.width * fabricCanvas.getWidth() - 2 * MARGIN;
          const areaBottom =
            areaTop + area.height * fabricCanvas.getHeight() - 2 * MARGIN;

          const boundingRect = obj.getBoundingRect(true);

          const newLeft =
            obj.left !== undefined
              ? Math.min(
                  Math.max(obj.left, areaLeft + boundingRect.width / 2),
                  areaRight - boundingRect.width / 2
                )
              : areaLeft;
          const newTop =
            obj.top !== undefined
              ? Math.min(
                  Math.max(obj.top, areaTop + boundingRect.height / 2),
                  areaBottom - boundingRect.height / 2
                )
              : areaTop;
          obj.set({ left: newLeft, top: newTop }).setCoords();
          isOutOfBounds = false;
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
