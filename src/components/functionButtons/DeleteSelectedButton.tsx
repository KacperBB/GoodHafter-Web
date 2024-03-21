// DeleteSelectedButton.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';

const DeleteSelectedButton = () => {
  const canvasContext = useCanvas();

  if (!canvasContext) {
    console.error('DeleteSelectedButton musi być używany wewnątrz CanvasProvider');
    return null; // lub inna obsługa błędu
  }

  const { deleteSelected } = canvasContext;

  return <button onClick={deleteSelected}>Usuń wybrany element</button>;
};

export default DeleteSelectedButton;