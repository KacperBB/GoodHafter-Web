"use client";

// NavigatorContainer.tsx
import React, { useContext } from "react";
import useCanvas from "@/context/useCanvas";
import NavigatorItem from "./NavigatorItem";
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { Layers } from "lucide-react";

const NavigatorContainer: React.FC = () => {
  const { objects, moveObject, isLoading } = useCanvas();

  const colors = [
    "red",
    "orange",
    "yellow",
    "green",
    "blue",
    "indigo",
    "violet",
  ]; // Dodaj więcej kolorów, jeśli potrzebujesz

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="fixed bottom-10 left-10">
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-muted-foreground">
            <Layers />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2 mb-2 ml-2 w-[250px] max-h-[300px] overflow-y-scroll  border-[1px] bg-[#0E1929] rounded-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <div className=" border-b-[1px] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <h4 className="px-5 py-2">Layers</h4>
        </div>
        <div className="px-1 flex flex-col gap-1  ">
          {objects
            .slice()
            .reverse()
            .map((object, index) => (
              <NavigatorItem
                key={index}
                object={object}
                index={index}
                moveObject={moveObject}
                color={colors[index % colors.length]}
              />
            ))}
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
};

export default NavigatorContainer;