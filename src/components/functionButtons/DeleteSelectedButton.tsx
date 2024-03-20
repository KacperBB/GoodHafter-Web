"use client";
// DeleteSelectedButton.tsx
import useCanvas from "@/context/CanvasContext";

const DeleteSelectedButton = () => {
  const { deleteSelected } = useCanvas();
  return <button onClick={deleteSelected}>Usuń wybrany element</button>;
};

export default DeleteSelectedButton;