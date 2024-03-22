'use client'

import { useContext } from 'react';
import useCanvas from '@/context/useCanvas';

const Navigator: React.FC = () => {
    const { objects, moveObject, isLoading } = useCanvas();

    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; // Dodaj więcej kolorów, jeśli potrzebujesz

    if (isLoading) {
        return <div>Ładowanie...</div>;
    }
    
    return (
        <div className=''>
            {objects.slice().reverse().map((object, index) => (
                object && (
                    <div key={index} style={{ color: colors[index % colors.length] }}>
                        <span>{object.name}</span> {/* Wyświetlamy nazwę obiektu zamiast jego typu */}
                        <button onClick={() => moveObject('up', index + 1)}>W dół</button>
                        <button onClick={() => moveObject('down', index - 1)}>W górę</button>
                    </div>
                )
            ))}
        </div>
    );
}

export default Navigator;