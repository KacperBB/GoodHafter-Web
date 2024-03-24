// FontWeightSelector.tsx
import { useCanvas } from "@/context/CanvasContext";
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const FontWeightSelector = () => {
    const { fontWeight, setFontWeight, handleFontWeightChange } = useCanvas();
    const [open, setOpen] = useState(false);
    const [currentFontWeight, setCurrentFontWeight] = useState(fontWeight);
    const fontWeights = [
        {
            value: "normal",
            label: "Normal",
        },
        {
            value: "bold",
            label: "Bold",
        },
        {
            value: "lighter",
            label: "Lighter",
        },
    ];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {currentFontWeight || "Select font weight..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search font weight..." />
                    <CommandEmpty>No font weight found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {fontWeights.map((fontWeight) => (
                                <CommandItem
                                    key={fontWeight.value}
                                    value={fontWeight.value}
                                    onSelect={(currentValue) => {
                                        const event = {
                                            target: {
                                                value: currentValue,
                                                name: 'fontWeightSelector',
                                            },
                                        } as React.ChangeEvent<HTMLSelectElement>;
                                        handleFontWeightChange(event);
                                        setFontWeight(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentFontWeight === fontWeight.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {fontWeight.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FontWeightSelector;