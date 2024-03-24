import CanvasEditor from "@/components/CanvasEditor";
import { CanvasProvider } from "@/context/CanvasContext";
import Image from "next/image";
import dynamic from "next/dynamic";
import Navigator from "@/components/navigator/Navigator";
import { Inter as FontSans } from "next/font/google"
 
import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
const CanvasComponentWithNoSSR = dynamic(
  () => import("../context/CanvasComponent"),
  {
    ssr: false,
  }
);
export default function Home() {
  return (
    <div >
        <div className="relative h-full w-full bg-slate-950 -z-10">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-semibold my-4">
            Personalizuj swój produkt
          </h2>
          <div className="grid grid-cols-2 gap-10 px-10">
            <CanvasProvider>
              <div>
                <CanvasEditor />
                <Navigator />
              </div>
              <div className="w-full min-h-[70dvh] max-h-[80dvh]">
                <CanvasComponentWithNoSSR />
              </div>
            </CanvasProvider>
          </div>
        </div>
      </div>
  );
}
