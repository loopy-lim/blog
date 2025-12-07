"use client";

import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle } from "react-konva";

const MAX_RADIUS = 1000;
const MIN_RADIUS = 800;

const COLOR = ["202, 26, 255", "244, 179, 0", "56, 255, 92"];
const CIRCLE_COLORS = COLOR.map((color) => `rgba(${color}, 0.3)`);
const CIRCLE_COLORS_GRADIENT = COLOR.map((color) => `rgba(${color}, 0)`);

interface BackgroundCircleProps {
  index: number;
}

export default function BackgroundCircle({ index }: BackgroundCircleProps) {
  const circleRef = useRef<Konva.Circle | null>(null);

  const velocityRef = useRef({
    x: (Math.random() - 0.5) * 4, // Increased speed range
    y: (Math.random() - 0.5) * 4,
  });

  const [initialProps] = useState(() => {
    // Ensure window is defined (client-side)
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const height = typeof window !== 'undefined' ? window.innerHeight : 1000;
    
    // Increased radius variance
    const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    return {
      radius: radius,
      x: Math.random() * width,
      y: Math.random() * height,
    };
  });

  useEffect(() => {
    const node = circleRef.current;
    if (!node) return;

    const animation = new Konva.Animation(() => {
      const stage = node.getStage();
      if (!stage) return;

      const stageWidth = stage.width();
      const stageHeight = stage.height();
      const velocity = velocityRef.current;

      const newX = node.x() + velocity.x;
      const newY = node.y() + velocity.y;

      // Wrap around instead of bounce for smoother flow
      if (newX < -initialProps.radius) node.x(stageWidth + initialProps.radius);
      else if (newX > stageWidth + initialProps.radius) node.x(-initialProps.radius);
      else node.x(newX);

      if (newY < -initialProps.radius) node.y(stageHeight + initialProps.radius);
      else if (newY > stageHeight + initialProps.radius) node.y(-initialProps.radius);
      else node.y(newY);
      
    }, node.getLayer());

    animation.start();

    return () => {
      animation.stop();
    };
  }, [initialProps.radius]);

  return (
    <Circle
      ref={circleRef}
      x={initialProps.x}
      y={initialProps.y}
      radius={initialProps.radius}
      fillRadialGradientStartPoint={{ x: 0, y: 0 }}
      fillRadialGradientEndPoint={{ x: 0, y: 0 }}
      fillRadialGradientStartRadius={0}
      fillRadialGradientEndRadius={initialProps.radius}
      fillRadialGradientColorStops={[
        0,
        CIRCLE_COLORS[index % CIRCLE_COLORS.length],
        1,
        CIRCLE_COLORS_GRADIENT[index % CIRCLE_COLORS_GRADIENT.length],
      ]}
    />
  );
}
