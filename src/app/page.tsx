import CanvasEditor from "@/components/CanvasEditor";
import { CanvasProvider } from "@/context/CanvasContext";
import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-semibold my-4">Personalizuj swój produkt</h2>
      <CanvasProvider>
      <CanvasEditor />
    </CanvasProvider>
    </div>
  );
}
