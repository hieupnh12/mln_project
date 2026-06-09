import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent } from "react";

export function useHeroParallax() {
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 90, damping: 24, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 90, damping: 24, mass: 0.4 });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const nextY = (event.clientY - bounds.top) / bounds.height - 0.5;

    rawX.set(nextX * 36);
    rawY.set(nextY * 36);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return {
    handlePointerLeave,
    handlePointerMove,
    x,
    y,
  };
}
