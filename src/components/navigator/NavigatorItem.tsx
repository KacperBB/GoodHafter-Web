// NavigatorItem.tsx
import React from 'react';
import { Badge } from '../ui/badge';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';
import { Button } from '../ui/button';

interface NavigatorItemProps {
    object: any;
    index: number;
    moveObject: (direction: 'up' | 'down', index: number) => void;
    color: string;
}

const NavigatorItem: React.FC<NavigatorItemProps> = ({ object, index, moveObject, color }) => (
    object && (
        <Badge variant="outline" className='rounded-sm px-5 py-2 text-muted-foreground flex flex-row gap-3 max-w-[250px] w-full justify-between bg-[#101c2e] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
            <span className='overflow-hidden whitespace-nowrap text-overflow-ellipsis'>{object.name}</span>
            <div className='flex flex-row gap-1'>
                <Button onClick={() => moveObject('down', index - 1)} variant='outline' className='w-fit h-auto aspect-square shadow-aesthetic p-2 text-muted-foreground'>
                    <ArrowUpFromLine className='p-1' />
                </Button>
                <Button onClick={() => moveObject('up', index + 1)} variant='outline' className='w-fit h-auto aspect-square shadow-aesthetic p-2 text-muted-foreground'>
                <ArrowDownFromLine className='p-1' />
                </Button>
            </div>
        </Badge>
    )
);
export default NavigatorItem;