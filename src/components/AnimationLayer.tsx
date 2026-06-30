"use client";

// Progressive enhancement: adds Framer Motion animations
// after the server-rendered HTML is already visible.
// If JS fails or is slow, the page still looks correct.

import { useEffect } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

function NavScroller() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 96],
    ["rgba(10,13,15,0.72)", "rgba(10,13,15,0.94)"]
  );
  const border = useTransform(
    scrollY,
    [0, 96],
    ["rgba(30,37,41,0)", "rgba(30,37,41,1)"]
  );

  useEffect(() => {
    const nav = document.getElementById("nav-root") as HTMLElement | null;
    if (!nav) return;
    const unsub1 = bg.on("change", (v) => (nav.style.backgroundColor = v));
    const unsub2 = border.on("change", (v) => (nav.style.borderColor = v));
    return () => { unsub1(); unsub2(); };
  }, [bg, border]);

  return null;
}

function WaterRingSpinner() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <motion.div
      className="water-ring-overlay"
      animate={{ rotate: 360 }}
      transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
    />
  );
}

function WaterDropFloat() {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;

  return (
    <motion.div
      className="water-drop-overlay"
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function AnimationLayer() {
  return (
    <>
      <NavScroller />
      <WaterRingSpinner />
      <WaterDropFloat />
    </>
  );
}
