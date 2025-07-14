import Konva from "konva";
import { useRef } from "react";
import { Group, Layer, Stage } from "react-konva";
import BackgroundCircle from "./backgroundCircle";
import BackgroundBottom from "./backgroundBottom";
import useResize from "../hooks/useResize";

const CIRCLE_COUNT = 20;

export default function IntroBackground() {
  const stage = useRef<Konva.Stage | null>(null);

  useResize(() => {
    if (stage.current) {
      const scale = window.devicePixelRatio || 1;
      stage.current.width(window.innerWidth);
      stage.current.height(window.innerHeight);
      stage.current.scale({ x: scale, y: scale });
    }
  });

  return (
    <div className="absolute top-0 left-0 -z-50 h-full min-h-screen w-full overflow-hidden">
      <div className="relative h-full w-full scale-110 blur-2xl">
        <Stage
          ref={stage}
          width={window.innerWidth}
          height={window.innerHeight}
        >
          <Layer>
            <Group globalCompositeOperation="saturation">
              {Array.from({ length: CIRCLE_COUNT }).map((_, index) => (
                <BackgroundCircle key={index} index={index} />
              ))}
            </Group>
          </Layer>
          <Layer>
            <BackgroundBottom />
          </Layer>
        </Stage>
        <div className="to-background pointer-events-none absolute bottom-0 h-[7vh] w-full bg-gradient-to-b from-transparent to-50%" />
      </div>
    </div>
  );
}
