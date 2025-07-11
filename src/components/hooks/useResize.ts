import { useEffect } from "react";

export default function useResize(onResize = () => { }) {
  useEffect(() => {
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);
}
