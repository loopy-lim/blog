"use client";

import Konva from "konva";
import { useRef } from "react";
import { Group, Layer, Stage } from "react-konva";
import BackgroundCircle from "./BackgroundCircle";
import useResize from "@/hooks/useResize";

const CIRCLE_COUNT = 20;

export default function GradientBackground() {
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
    <div className="absolute top-0 left-0 z-0 h-full min-h-screen w-full overflow-hidden bg-white dark:bg-gray-950">
      <div className="relative h-full w-full scale-110 blur-2xl opacity-60 dark:opacity-40">
        <Stage
          ref={stage}
          width={typeof window !== 'undefined' ? window.innerWidth : 1000}
          height={typeof window !== 'undefined' ? window.innerHeight : 1000}
        >
          <Layer>
            <Group>
              {Array.from({ length: CIRCLE_COUNT }).map((_, index) => (
                <BackgroundCircle key={index} index={index} />
              ))}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
