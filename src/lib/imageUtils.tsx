import { fabric } from "fabric";

export const addImage =
  (canvasInstanceRef: React.RefObject<fabric.Canvas>, setObjects: Function) =>
  (url: string) => {
    if (canvasInstanceRef.current) {
      fabric.Image.fromURL(
        url,
        (img) => {
          const imageName = url.startsWith("data:image")
            ? `Image_${Date.now()}`
            : url;
          const canvasWidth = canvasInstanceRef.current
            ? (canvasInstanceRef.current.width || 0) - 2
            : 0;
          const canvasHeight = canvasInstanceRef.current
            ? (canvasInstanceRef.current.height || 0) / 3
            : 0;

          if (img) {
            if (img.width && img.width > canvasWidth) {
              img.scaleToWidth(canvasWidth);
            }

            if (img.height && img.height > canvasHeight) {
              img.scaleToHeight(canvasHeight / 2);
            }

            img.set({
              left: (canvasInstanceRef.current?.width || 0) / 2,
              top: (canvasInstanceRef.current?.height || 0) / 2,
              originX: "center",
              originY: "center",
              selectable: true,
              hasControls: true,
              name: imageName,
            });

            img.toObject = ((toObject) => {
              return function (this: fabric.Image) {
                return fabric.util.object.extend(toObject.call(this), {
                  name: this.name,
                });
              };
            })(img.toObject);

            const existingObject = canvasInstanceRef.current
              ?.getObjects()
              .find((o) => o.toObject() === img.toObject());

            if (!existingObject) {
              canvasInstanceRef.current?.add(img);
              setObjects(canvasInstanceRef.current?.getObjects() || []);
            }
          }
        },
        { crossOrigin: "anonymous" }
      );
    }
  };
