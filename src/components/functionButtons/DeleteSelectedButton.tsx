// DeleteSelectedButton.tsx
import { useCanvas } from '@/context/CanvasContext';
import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

const DeleteSelectedButton = () => {
  const canvasContext = useCanvas();

  if (!canvasContext) {
    console.error('DeleteSelectedButton musi być używany wewnątrz CanvasProvider');
    return null; // lub inna obsługa błędu
  }

  const { deleteSelected } = canvasContext;

  return <Button onClick={deleteSelected} variant='outline' className='w-fit h-auto aspect-square shadow-aesthetic p-2 text-muted-foreground'>
    <Trash2 className='p-1'/>
  </Button>;
};

export default DeleteSelectedButton;