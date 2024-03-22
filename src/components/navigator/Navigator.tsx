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
                        <button onClick={() => moveObject('up', objects.length - 1 - index)}>W górę</button>
                        <button onClick={() => moveObject('down', objects.length - 1 - index)}>W dół</button>
                    </div>
                )
            ))}
        </div>
    );
}

export default Navigator;