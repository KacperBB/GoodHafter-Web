// CanvasEditor.tsx
import dynamic from 'next/dynamic';

const CanvasEditor = dynamic(() => import('./CanvasEditorInner.client'), {
  ssr: false,
});

export default CanvasEditor;