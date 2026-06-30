"use client";

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
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

// ─── 1. Nav: backdrop blur on scroll ──────────────────────────────────────────
function NavScroller() {
  const { scrollY } = useScroll();
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(10,13,15,0)", "rgba(10,13,15,0.92)"]
  );
  const border = useTransform(
    scrollY,
    [0, 80],
    ["rgba(30,37,41,0)", "rgba(30,37,41,0.8)"]
  );
  useEffect(() => {
    const nav = document.getElementById("nav-root") as HTMLElement | null;
    if (!nav) return;
    const u1 = bg.on("change", (v) => (nav.style.backgroundColor = v));
    const u2 = border.on("change", (v) => (nav.style.borderBottomColor = v));
    return () => { u1(); u2(); };
  }, [bg, border]);
  return null;
}

// ─── 2. Hero parallax: image scrolls slower than content ──────────────────────
function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const hero = document.getElementById("hero-bg-layer") as HTMLElement | null;
    const overlay = document.getElementById("hero-overlay") as HTMLElement | null;
    if (!hero || !overlay) return;
    const uy = y.on("change", (v) => (hero.style.transform = `translateY(${v}) scale(${scale.get()})`));
    const us = scale.on("change", (v) => (hero.style.transform = `translateY(${y.get()}) scale(${v})`));
    const uo = opacity.on("change", (v) => (overlay.style.opacity = String(1 - v * 0.3)));
    return () => { uy(); us(); uo(); };
  }, [y, scale, opacity]);

  return <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

// ─── 3. Word-by-word text reveal ──────────────────────────────────────────────
function WordReveal({ selector }: { selector: string }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      const original = el.textContent || "";
      const words = original.split(" ");
      el.innerHTML = words
        .map(
          (w, i) =>
            `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
            `<span class="word" style="display:inline-block;transform:translateY(110%);opacity:0;transition:transform 0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s,opacity 0.65s ease ${i * 0.07}s">${w}</span>` +
            `</span>${i < words.length - 1 ? " " : ""}`
        )
        .join("");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>(".word").forEach((w) => {
              w.style.transform = "translateY(0)";
              w.style.opacity = "1";
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, reduced]);

  return null;
}

// ─── 4. Magnetic buttons ──────────────────────────────────────────────────────
function MagneticButtons() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const buttons = document.querySelectorAll<HTMLElement>(".button-primary");

    const handlers: Array<() => void> = [];

    buttons.forEach((btn) => {
      btn.style.transition = "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease";
      btn.style.willChange = "transform";

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.35;
        const dy = (e.clientY - cy) * 0.35;
        btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
        btn.style.boxShadow = `0 20px 48px rgba(58,158,217,0.38)`;
      };
      const onLeave = () => {
        btn.style.transform = "translate(0,0) scale(1)";
        btn.style.boxShadow = "0 12px 32px rgba(58,158,217,0.2)";
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => handlers.forEach((h) => h());
  }, [reduced]);

  return null;
}

// ─── 5. Floating water particles ──────────────────────────────────────────────
type Particle = {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

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

  if (reduced || particles.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            bottom: -20,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%, rgba(45,212,164,${p.opacity}), rgba(58,158,217,${p.opacity * 0.6}))`,
            boxShadow: `0 0 ${p.size * 2}px rgba(58,158,217,${p.opacity * 0.5})`,
          }}
          animate={{
            y: [0, -(window.innerHeight + 60)],
            x: [0, (Math.random() - 0.5) * 80],
            opacity: [0, p.opacity, p.opacity, 0],
            scale: [0.4, 1, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── 6. Stats counter animation ───────────────────────────────────────────────
function AnimatedCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;

    const counters = document.querySelectorAll<HTMLElement>(".stats-bar strong");
    counters.forEach((el) => {
      const raw = el.textContent || "";
      const num = parseFloat(raw.replace(/[^0-9.]/g, ""));
      if (isNaN(num)) return;
      const suffix = raw.replace(/[0-9.]/g, "");
      const from = 0;
      const ctrl = animate(from, num, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          el.textContent =
            (Number.isInteger(num) ? Math.round(v) : v.toFixed(2)) + suffix;
        },
      });
      return () => ctrl.stop();
    });
  }, [inView, reduced]);

  return <div ref={ref} style={{ position: "absolute", pointerEvents: "none" }} />;
}

// ─── 7. Card tilt on hover ────────────────────────────────────────────────────
function CardTilt() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const cards = document.querySelectorAll<HTMLElement>(".card");
    const handlers: Array<() => void> = [];

    cards.forEach((card) => {
      card.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease";
      card.style.willChange = "transform";
      card.style.transformStyle = "preserve-3d";

      const onMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.03)`;
        card.style.boxShadow = `${-x * 16}px ${-y * 16}px 40px rgba(58,158,217,0.15), 0 8px 32px rgba(0,0,0,0.4)`;
      };
      const onLeave = () => {
        card.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
        card.style.boxShadow = "";
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => handlers.forEach((h) => h());
  }, [reduced]);

  return null;
}

// ─── 8. Scroll progress bar ───────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "linear-gradient(90deg, #3a9ed9, #2dd4a4)",
        transformOrigin: "0%",
        scaleX,
        zIndex: 100,
      }}
      aria-hidden="true"
    />
  );
}

// ─── 9. Section fade-in on scroll ─────────────────────────────────────────────
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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [reduced]);

  return null;
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function AnimationLayer() {
  return (
    <>
      <ScrollProgressBar />
      <WaterParticles />
      <NavScroller />
      <HeroParallax />
      <MagneticButtons />
      <WordReveal selector="h1, h2" />
      <AnimatedCounters />
      <CardTilt />
      <SectionReveal />
    </>
  );
}
