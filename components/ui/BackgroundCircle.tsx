"use client";

import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Rect } from "react-konva";

const MAX_RADIUS = 600; // 줄여서 성능 개선
const MIN_RADIUS = 400; // 줄여서 성능 개선

const COLOR = ["202, 26, 255", "244, 179, 0", "56, 255, 92"];
const CIRCLE_COLORS = COLOR.map((color) => `rgba(${color}, 0.2)`); // 투명도 낮춤
const CIRCLE_COLORS_GRADIENT = COLOR.map((color) => `rgba(${color}, 0)`);

interface BackgroundCircleProps {
  index: number;
}

export default function BackgroundCircle({ index }: BackgroundCircleProps) {
  const shapeRef = useRef<Konva.Rect | null>(null);

  const velocityRef = useRef({
    x: (Math.random() - 0.5) * 2, // 속도 줄임
    y: (Math.random() - 0.5) * 2, // 속도 줄임
  });

  const [initialProps] = useState(() => {
    // Ensure window is defined (client-side)
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1000;

    const size = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    return {
      size: size,
      x: Math.random() * width,
      y: Math.random() * height,
      rotation: Math.random() * 360,
    };
  });

  useEffect(() => {
    const node = shapeRef.current;
    if (!node) return;

    const animation = new Konva.Animation(() => {
      const stage = node.getStage();
      if (!stage) return;

      const stageWidth = stage.width();
      const stageHeight = stage.height();
      const velocity = velocityRef.current;

      const newX = node.x() + velocity.x;
      const newY = node.y() + velocity.y;

      // Wrap around for smooth flow
      if (newX < -initialProps.size) node.x(stageWidth + initialProps.size);
      else if (newX > stageWidth + initialProps.size) node.x(-initialProps.size);
      else node.x(newX);

      if (newY < -initialProps.size) node.y(stageHeight + initialProps.size);
      else if (newY > stageHeight + initialProps.size) node.y(-initialProps.size);
      else node.y(newY);

      node.rotation(node.rotation() + 0.1);

    }, node.getLayer());

    animation.start();

    return () => {
      animation.stop();
    };
  }, [initialProps.size]);

  return (
    <Rect
      ref={shapeRef}
      x={initialProps.x}
      y={initialProps.y}
      width={initialProps.size}
      height={initialProps.size}
      cornerRadius={initialProps.size / 4}
      rotation={initialProps.rotation}
      fillRadialGradientStartPoint={{ x: initialProps.size / 2, y: initialProps.size / 2 }}
      fillRadialGradientEndPoint={{ x: initialProps.size / 2, y: initialProps.size / 2 }}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={initialProps.size}
      fillRadialGradientColorStops={[
        0,
        CIRCLE_COLORS[index % CIRCLE_COLORS.length],
        1,
        CIRCLE_COLORS_GRADIENT[index % CIRCLE_COLORS_GRADIENT.length],
      ]}
    />
  );
}
