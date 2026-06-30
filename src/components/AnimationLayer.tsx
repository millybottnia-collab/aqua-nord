"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
  animate,
  useMotionValue,
} from "framer-motion";

// ─── 1. Nav backdrop blur on scroll ───────────────────────────────────────────
function NavScroller() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(10,13,15,0)", "rgba(10,13,15,0.92)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(30,37,41,0)", "rgba(30,37,41,0.8)"]);
  useEffect(() => {
    const nav = document.getElementById("nav-root") as HTMLElement | null;
    if (!nav) return;
    const u1 = bg.on("change", (v) => (nav.style.backgroundColor = v));
    const u2 = border.on("change", (v) => (nav.style.borderBottomColor = v));
    return () => { u1(); u2(); };
  }, [bg, border]);
  return null;
}

// ─── 2. Hero parallax ─────────────────────────────────────────────────────────
function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  useEffect(() => {
    const hero = document.getElementById("hero-bg-layer") as HTMLElement | null;
    if (!hero) return;
    const uy = y.on("change", (v) => (hero.style.transform = `translateY(${v}) scale(${scale.get()})`));
    const us = scale.on("change", (v) => (hero.style.transform = `translateY(${y.get()}) scale(${v})`));
    return () => { uy(); us(); };
  }, [y, scale]);
  return <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

// ─── 3. Cursor glow (desktop only) ────────────────────────────────────────────
function CursorGlow() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: MouseEvent) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, reduced]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0,
        x: springX, y: springY,
        translateX: "-50%", translateY: "-50%",
        width: 400, height: 400,
        borderRadius: "50%", pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(circle at center, rgba(58,158,217,0.10) 0%, rgba(45,212,164,0.05) 40%, transparent 70%)",
      }}
    />
  );
}

// ─── 4. Water ripple on click ─────────────────────────────────────────────────
function WaterRipples() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const buttons = document.querySelectorAll<HTMLElement>(".button");
    const handlers: Array<() => void> = [];
    buttons.forEach((btn) => {
      btn.style.overflow = "hidden";
      const onClick = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.22);width:4px;height:4px;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;transform:translate(-50%,-50%) scale(0);pointer-events:none;animation:ripple-expand 0.65s cubic-bezier(0.16,1,0.3,1) forwards;`;
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 750);
      };
      btn.addEventListener("click", onClick);
      handlers.push(() => btn.removeEventListener("click", onClick));
    });
    if (!document.getElementById("ripple-kf")) {
      const s = document.createElement("style");
      s.id = "ripple-kf";
      s.textContent = "@keyframes ripple-expand { to { transform: translate(-50%,-50%) scale(80); opacity: 0; } }";
      document.head.appendChild(s);
    }
    return () => handlers.forEach((h) => h());
  }, [reduced]);
  return null;
}

// ─── 5. Floating water particles ──────────────────────────────────────────────
type Particle = { id: number; x: number; size: number; delay: number; duration: number; opacity: number };

function WaterParticles() {
  const reduced = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (reduced) return;
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 3 + Math.random() * 6,
        delay: Math.random() * 8,
        duration: 7 + Math.random() * 10,
        opacity: 0.15 + Math.random() * 0.35,
      }))
    );
  }, [reduced]);

  if (!particles.length) return null;

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }} aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute", bottom: -20, left: `${p.x}%`,
            width: p.size, height: p.size, borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, rgba(45,212,164,${p.opacity}), rgba(58,158,217,${p.opacity * 0.6}))`,
            boxShadow: `0 0 ${p.size * 2}px rgba(58,158,217,${p.opacity * 0.4})`,
          }}
          animate={{
            y: [0, -(typeof window !== "undefined" ? window.innerHeight : 900) - 60],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.4, 1, 1, 0.3],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── 6. Magnetic buttons (desktop) ────────────────────────────────────────────
function MagneticButtons() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const buttons = document.querySelectorAll<HTMLElement>(".button-primary");
    const handlers: Array<() => void> = [];
    buttons.forEach((btn) => {
      btn.style.transition = "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease";
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        btn.style.transform = `translate(${dx}px,${dy}px) scale(1.06)`;
        btn.style.boxShadow = "0 20px 48px rgba(58,158,217,0.38)";
      };
      const onLeave = () => { btn.style.transform = ""; btn.style.boxShadow = ""; };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      handlers.push(() => { btn.removeEventListener("mousemove", onMove); btn.removeEventListener("mouseleave", onLeave); });
    });
    return () => handlers.forEach((h) => h());
  }, [reduced]);
  return null;
}

// ─── 7. Word-by-word text reveal ──────────────────────────────────────────────
function WordReveal({ selector }: { selector: string }) {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const els = document.querySelectorAll<HTMLElement>(selector);
    els.forEach((el) => {
      const words = (el.textContent || "").split(" ");
      el.innerHTML = words
        .map((w, i) =>
          `<span style="display:inline-block;overflow:hidden;vertical-align:bottom"><span style="display:inline-block;transform:translateY(110%);opacity:0;transition:transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s,opacity 0.5s ease ${i * 0.07}s">${w}</span></span>${i < words.length - 1 ? " " : ""}`
        ).join("");
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll<HTMLElement>("span > span").forEach((w) => {
            w.style.transform = "translateY(0)";
            w.style.opacity = "1";
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, reduced]);
  return null;
}

// ─── 8. Animated stat counters ────────────────────────────────────────────────
function AnimatedCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!inView || reduced) return;
    document.querySelectorAll<HTMLElement>(".stats-bar strong").forEach((el) => {
      const raw = el.textContent || "";
      const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) return;
      const suffix = raw.replace(/[0-9.]/g, "");
      animate(0, num, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => { el.textContent = (Number.isInteger(num) ? Math.round(v) : v.toFixed(2)) + suffix; },
      });
    });
  }, [inView, reduced]);
  return <div ref={ref} style={{ position: "absolute", pointerEvents: "none" }} />;
}

// ─── 9. 3D card tilt (desktop) ────────────────────────────────────────────────
function CardTilt() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    const cards = document.querySelectorAll<HTMLElement>(".card");
    const handlers: Array<() => void> = [];
    cards.forEach((card) => {
      card.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease";
      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.03)`;
        card.style.boxShadow = `${-x * 16}px ${-y * 16}px 40px rgba(58,158,217,0.15), 0 8px 32px rgba(0,0,0,0.4)`;
      };
      const onLeave = () => { card.style.transform = ""; card.style.boxShadow = ""; };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => { card.removeEventListener("mousemove", onMove); card.removeEventListener("mouseleave", onLeave); });
    });
    return () => handlers.forEach((h) => h());
  }, [reduced]);
  return null;
}

// ─── 10. Scroll progress bar ──────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, #3a9ed9, #2dd4a4)",
        transformOrigin: "0%", scaleX, zIndex: 100,
      }}
    />
  );
}

// ─── 11. Section reveal on scroll ────────────────────────────────────────────
function SectionReveal() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const sections = document.querySelectorAll<HTMLElement>(".section, .stats-bar");
    sections.forEach((s) => {
      s.style.opacity = "0";
      s.style.transform = "translateY(40px)";
      s.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [reduced]);
  return null;
}

// ─── 12. Interactive SVG wave ─────────────────────────────────────────────────
function InteractiveWave() {
  const reduced = useReducedMotion();
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const cp1x = useTransform(mouseX, [0, 1], [20, 80]);
  const cp1y = useTransform(mouseY, [0, 1], [35, 65]);
  const cp2x = useTransform(mouseX, [0, 1], [65, 35]);
  const cp2y = useTransform(mouseY, [0, 1], [65, 35]);
  const [d, setD] = useState("M0,50 C25,35 75,65 100,50 L100,100 L0,100 Z");

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, reduced]);

  useEffect(() => {
    if (reduced) return;
    const u = cp1x.on("change", () =>
      setD(`M0,50 C${cp1x.get().toFixed(1)},${cp1y.get().toFixed(1)} ${cp2x.get().toFixed(1)},${cp2y.get().toFixed(1)} 100,50 L100,100 L0,100 Z`)
    );
    return u;
  }, [cp1x, cp1y, cp2x, cp2y, reduced]);

  return (
    <div aria-hidden="true" style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, pointerEvents: "none", overflow: "hidden" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="waveGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(58,158,217,0.09)" />
            <stop offset="100%" stopColor="rgba(45,212,164,0.09)" />
          </linearGradient>
        </defs>
        <motion.path d={d} fill="url(#waveGrad)" animate={{ d }} transition={{ duration: 0.35, ease: "easeOut" }} />
      </svg>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AnimationLayer() {
  return (
    <>
      <ScrollProgressBar />
      <CursorGlow />
      <WaterParticles />
      <NavScroller />
      <HeroParallax />
      <MagneticButtons />
      <WaterRipples />
      <WordReveal selector="h1, h2" />
      <AnimatedCounters />
      <CardTilt />
      <SectionReveal />
      <InteractiveWave />
    </>
  );
}
