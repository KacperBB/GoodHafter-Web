'use client'

import { useContext } from 'react';
import useCanvas from '@/context/useCanvas';

const Navigator: React.FC = () => {
    const canvasContext = useCanvas();

    // Navigator.tsx
const { objects, moveObject } = useCanvas();

return (
    <div className=''>
        {objects.map((object, index) => (
            <div key={index}>
                <span>{object.type}</span>
                <button onClick={() => moveObject('up')}>W górę</button>
                <button onClick={() => moveObject('down')}>W dół</button>
            </div>
        ))}
    </div>
);
        }
export default Navigator;  

