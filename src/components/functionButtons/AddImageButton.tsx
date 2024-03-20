// AddImageButton.tsx
import { useCanvas } from "@/context/CanvasContext";
import { ChangeEvent } from "react";

const AddImageButton = () => {
    const { addImage } = useCanvas();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = function (event) {
            if (event.target) {
                addImage && addImage(event.target.result as string);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
    );
};

export default AddImageButton;