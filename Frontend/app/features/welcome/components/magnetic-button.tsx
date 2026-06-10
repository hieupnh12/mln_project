import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router";

type BaseProps = {
  children: ReactNode;
  className?: string;
};

type AnchorButtonProps = BaseProps & {
  href: string;
  id?: string;
  "aria-label"?: string;
  to?: never;
};

type LinkButtonProps = BaseProps & {
  to: string;
  href?: never;
};

type MagneticButtonProps = AnchorButtonProps | LinkButtonProps;

export function MagneticButton({ children, className = "", ...props }: MagneticButtonProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.035, y: -2 },
        whileTap: { scale: 0.98 },
      };

  if ("to" in props && props.to) {
    return (
      <motion.div {...motionProps}>
        <Link className={`landing-magnetic ${className}`} to={props.to}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.a {...motionProps} className={`landing-magnetic ${className}`} {...props}>
      {children}
    </motion.a>
  );
}
