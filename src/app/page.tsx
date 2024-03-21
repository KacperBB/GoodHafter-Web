import CanvasEditor from "@/components/CanvasEditor";
import { CanvasProvider } from "@/context/CanvasContext";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navigator from "@/components/navigator/Navigator";

const CanvasComponentWithNoSSR = dynamic(
  () => import("../context/CanvasComponent"),
  {
    ssr: false,
  }
);
export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <h2 className="text-xl font-semibold my-4">Personalizuj swój produkt</h2>
      <CanvasProvider>
        <CanvasComponentWithNoSSR />
        <CanvasEditor />
        <Navigator />
      </CanvasProvider>
    </div>
  );
}
