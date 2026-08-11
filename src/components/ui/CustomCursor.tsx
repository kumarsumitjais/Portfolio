"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);

  const springConfigOuter = { damping: 30, stiffness: 200 };
  const cursorXOuter = useSpring(mousePosition.x, springConfigOuter);
  const cursorYOuter = useSpring(mousePosition.y, springConfigOuter);

  if (!isMounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 border border-electric-blue-500/40 rounded-full pointer-events-none z-[9999] hidden md:block backdrop-blur-[1px]"
      style={{
        x: cursorXOuter,
        y: cursorYOuter,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isHovering ? "rgba(46,107,255,0.15)" : "rgba(46,107,255,0.05)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    />
  );
}
