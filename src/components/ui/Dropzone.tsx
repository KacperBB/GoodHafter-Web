import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCanvas } from "@/context/CanvasContext";
import { cn } from "@/lib/utils";
import { CloudUpload } from "lucide-react";
import React, { ChangeEvent, useRef } from "react";

interface DropzoneProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "value" | "onChange"
    > {
    classNameWrapper?: string;
    className?: string;
    dropMessage: string;
    handleOnDrop: (acceptedFiles: FileList | null) => void;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
    (
        { className, classNameWrapper, dropMessage, handleOnDrop, ...props },
        ref
    ) => {
        const { addImage } = useCanvas();

        const inputRef = useRef<HTMLInputElement | null>(null);
        // Function to handle drag over event
        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            handleOnDrop(null);
        };

        // Function to handle drop event
        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const { files } = e.dataTransfer;
            if (inputRef.current) {
                inputRef.current.files = files;
                handleOnDrop(files);
            }
        };

        // Function to simulate a click on the file input element
        const handleButtonClick = () => {
            if (inputRef.current) {
                inputRef.current.click();
            }
        };

        const handleFormSubmit = (data: any) => {
          console.log(data);
          if (data.file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              addImage(reader.result as string);
            };
            reader.readAsDataURL(data.file);
          }
        };
        return (
            <Card
                ref={ref}
                className={cn(
                    `border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
                    classNameWrapper
                )}
            >
                <CardContent
                    className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs min-h-[200px]"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleButtonClick}
                >
                    <div className="flex items-center justify-center text-muted-foreground flex flex-col">
                        <CloudUpload size={100} />
                        <span className="font-medium">{dropMessage}</span>
                        <Input
                            {...props}
                            value={undefined}
                            ref={inputRef}
                            type="file"
                            className={cn("hidden", className)}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                handleOnDrop(e.target.files)
                            }
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }
);

Dropzone.displayName = 'Dropzone';

export default Dropzone;