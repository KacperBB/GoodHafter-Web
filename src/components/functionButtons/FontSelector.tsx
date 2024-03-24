// FontSelector.tsx
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

const FontSelector = () => {
    const { selectedFont, setSelectedFont, handleFontChange } = useCanvas();
    const [open, setOpen] = useState(false);
    const [currentFont, setCurrentFont] = useState(selectedFont);
    const fonts = [
        {
            value: "Arial",
            label: "Arial",
        },
        {
            value: "Helvetica",
            label: "Helvetica",
        },
        {
            value: "Times New Roman",
            label: "Times New Roman",
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
                    {currentFont || "Select font..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search font..." />
                    <CommandEmpty>No font found.</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {fonts.map((font) => (
                                <CommandItem
                                    key={font.value}
                                    value={font.value}
                                    onSelect={(currentValue) => {
                                        const event = {
                                            target: {
                                                value: currentValue,
                                                name: 'fontSelector',
                                            },
                                        } as React.ChangeEvent<HTMLSelectElement>;
                                        handleFontChange(event);
                                        setSelectedFont(currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedFont === font.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {font.label}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default FontSelector;
