import Konva from "konva";
import { useEffect, useRef, useState } from "react";
import { Circle } from "react-konva";

const MAX_RADIUS = 1000;
const MIN_RADIUS = 800;

const COLOR = ["255, 0, 0", "0, 255, 0", "0, 0, 255"];
const CIRCLE_COLORS = COLOR.map((color) => `rgba(${color}, 0.2)`);
const CIRCLE_COLORS_GRADIENT = COLOR.map((color) => `rgba(${color}, 0)`);

interface BackgroundCircleProps {
  index: number;
}

export default function BackgroundCircle({ index }: BackgroundCircleProps) {
  const circleRef = useRef<Konva.Circle | null>(null);

  const velocityRef = useRef({
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10,
  });

  const [initialProps] = useState(() => {
    const radius = Math.random() * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
    return {
      radius: radius,
      x: Math.random() * (window.innerWidth - radius * 2) + radius,
      y: Math.random() * (window.innerHeight - radius * 2) + radius,
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

      if (newX < 0 || newX > stageWidth) {
        velocity.x = -velocity.x;
      }
      if (newY < 0 || newY > stageHeight) {
        velocity.y = -velocity.y;
      }
      node.x(newX);
      node.y(newY);
    }, node.getLayer());

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

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
