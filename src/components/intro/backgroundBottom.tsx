import Konva from "konva";
import { useEffect, useRef } from "react";
import { Ellipse, Group, Rect } from "react-konva";
import useResize from "../hooks/useResize";
import useTheme from "../hooks/useTheme";

export default function BackgroundBottom() {
  const { isDark } = useTheme();
  const circleRef = useRef<Konva.Ellipse | null>(null);
  const rectRef = useRef<Konva.Rect | null>(null);

  useResize(() => {
    circleRef.current?.setAttrs({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2 - 150,
      radiusX: window.innerWidth * 0.9,
      radiusY: window.innerHeight * 0.5,
    });
    rectRef.current?.setAttrs({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  useEffect(() => {
    const node = circleRef.current;
    if (!node) return;
    const animation = new Konva.Animation((frame) => {
      const stage = node.getStage();
      if (!stage) return;

      // change scale based on time
      const scale = 1 + Math.sin((frame?.time ?? 0) * 0.002) * 0.04;
      node.scaleX(scale);
      node.scaleY(scale);
    }, node.getLayer());

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <Group>
      <Rect
        ref={rectRef}
        x={0}
        y={0}
        width={window.innerWidth}
        height={window.innerHeight}
        fill={isDark ? "#101828" : "#fff"}
      />
      <Ellipse
        ref={circleRef}
        x={window.innerWidth / 2}
        y={window.innerHeight / 2 - 150}
        radiusX={window.innerWidth * 0.9}
        radiusY={window.innerHeight * 0.5}
        fill="#0048fd"
        globalCompositeOperation="destination-out"
      />
    </Group>
  );
}
