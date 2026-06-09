import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
};

export function TiltCard({ children, className }: TiltCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 180, damping: 20 });
  const rotateY = useSpring(rotateYValue, { stiffness: 180, damping: 20 });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXValue.set(y * -8);
    rotateYValue.set(x * 8);
  }

  function handlePointerLeave() {
    rotateXValue.set(0);
    rotateYValue.set(0);
  }

  return (
    <motion.article
      className={`landing-3d-card ${className ?? ""}`}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={{ rotateX, rotateY }}
    >
      {children}
    </motion.article>
  );
}
