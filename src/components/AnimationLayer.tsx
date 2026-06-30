"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const navLinks = ["Purity", "Process", "Stories", "Contact"];
const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function SmoothScroll() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduced || !isDesktop) return;

    let cleanup = () => {};
    let frame = 0;
    let cancelled = false;

    const start = async () => {
      try {
        const packageName = "@studio-freight/lenis";
        const module = await import(/* webpackIgnore: true */ packageName);
        if (cancelled) return;
        const Lenis = module.default;
        const lenis = new Lenis({
          duration: 1.15,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
        });
        const raf = (time: number) => {
          lenis.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
        cleanup = () => {
          cancelAnimationFrame(frame);
          lenis.destroy();
        };
      } catch {
        document.documentElement.style.scrollBehavior = "smooth";
        cleanup = () => {
          document.documentElement.style.scrollBehavior = "";
        };
      }
    };

    start();
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isDesktop, reduced]);

  return null;
}

function AnimatedGradientBackground() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const backgrounds = [
      "radial-gradient(circle at 50% 0%, rgba(58,158,217,0.14), transparent 34rem), linear-gradient(135deg, #05070b 0%, #061923 46%, #020405 100%)",
      "radial-gradient(circle at 18% 12%, rgba(45,212,164,0.13), transparent 32rem), linear-gradient(135deg, #021415 0%, #082a31 48%, #05070a 100%)",
      "radial-gradient(circle at 76% 10%, rgba(58,158,217,0.12), transparent 30rem), linear-gradient(135deg, #000204 0%, #061119 45%, #082923 100%)",
    ];

    document.body.style.background = backgrounds[0];
    const controls = animate(document.body, { background: backgrounds }, {
      duration: 8,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    });

    return () => controls.stop();
  }, [reduced]);

  return null;
}

function NavScroller() {
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(10,13,15,0)", "rgba(10,13,15,0.92)"]);
  const border = useTransform(scrollY, [0, 80], ["rgba(30,37,41,0)", "rgba(30,37,41,0.8)"]);

  useEffect(() => {
    const nav = document.getElementById("nav-root") as HTMLElement | null;
    if (!nav) return;
    const unsubscribeBg = bg.on("change", (value) => (nav.style.backgroundColor = value));
    const unsubscribeBorder = border.on("change", (value) => (nav.style.borderBottomColor = value));
    return () => {
      unsubscribeBg();
      unsubscribeBorder();
    };
  }, [bg, border]);

  return null;
}

function HeroParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);

  useEffect(() => {
    if (reduced) return;
    const hero = document.getElementById("hero-bg-layer") as HTMLElement | null;
    if (!hero) return;
    const update = () => (hero.style.transform = `translateY(${y.get()}) scale(${scale.get()})`);
    const unsubscribeY = y.on("change", update);
    const unsubscribeScale = scale.on("change", update);
    update();
    return () => {
      unsubscribeY();
      unsubscribeScale();
    };
  }, [reduced, scale, y]);

  return <div ref={ref} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

function HeroStaggerEntrance() {
  const reduced = useReducedMotion();
  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.08,
      },
    },
  }), []);
  const itemVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  }), []);

  useEffect(() => {
    if (reduced) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".hero-stagger-item"));
    items.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(28px)";
    });
    items.forEach((item, index) => {
      animate(item, { opacity: itemVariants.show.opacity, transform: "translateY(0px)" } as Record<string, string | number>, {
        delay: variants.show.transition.delayChildren + index * variants.show.transition.staggerChildren,
        duration: itemVariants.show.transition.duration,
        ease: itemVariants.show.transition.ease,
      });
    });
  }, [itemVariants, reduced, variants]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ display: "none" }}
      variants={variants}
      initial={reduced ? false : "hidden"}
      animate={reduced ? false : "show"}
    >
      {Array.from({ length: 4 }, (_, index) => (
        <motion.span key={index} variants={itemVariants} />
      ))}
    </motion.div>
  );
}

function TextScramble() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const headline = document.querySelector<HTMLElement>(".hero-scramble");
    if (!headline) return;

    const finalText = headline.dataset.text || headline.textContent || "";
    const duration = 1500;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const resolved = Math.floor(progress * finalText.length);
      headline.textContent = finalText
        .split("")
        .map((char, index) => {
          if (char === " " || index < resolved) return char;
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        })
        .join("");

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        headline.textContent = finalText;
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  return null;
}

function MagneticNavLink({ label }: { label: string }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 20, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 260, damping: 20, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".magnetic-link"));
    const link = links.find((item) => item.textContent?.trim() === label);
    if (!link) return;

    const update = () => {
      link.style.transform = `translate3d(${springX.get()}px, ${springY.get()}px, 0)`;
    };
    const unsubscribeX = springX.on("change", update);
    const unsubscribeY = springY.on("change", update);

    const onMove = (event: MouseEvent) => {
      const rect = link.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
      y.set((event.clientY - rect.top - rect.height / 2) * 0.32);
    };
    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    link.addEventListener("mousemove", onMove);
    link.addEventListener("mouseleave", onLeave);
    return () => {
      unsubscribeX();
      unsubscribeY();
      link.removeEventListener("mousemove", onMove);
      link.removeEventListener("mouseleave", onLeave);
      link.style.transform = "";
    };
  }, [label, reduced, springX, springY, x, y]);

  return null;
}

function MagneticNavLinks() {
  return (
    <>
      {navLinks.map((link) => (
        <MagneticNavLink key={link} label={link} />
      ))}
    </>
  );
}

function ParticleField() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduced || !isDesktop) return;

    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement | null;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00016,
      vy: (Math.random() - 0.5) * 0.00016,
      radius: 1.2 + Math.random() * 1.8,
    }));

    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
        if (particle.y < 0 || particle.y > 1) particle.vy *= -1;
        particle.x = Math.max(0, Math.min(1, particle.x));
        particle.y = Math.max(0, Math.min(1, particle.y));
      });

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        const ax = a.x * width;
        const ay = a.y * height;

        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const bx = b.x * width;
          const by = b.y * height;
          const distance = Math.hypot(ax - bx, ay - by);

          if (distance < 150) {
            context.strokeStyle = `rgba(58,158,217,${0.06 * (1 - distance / 150)})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(ax, ay);
            context.lineTo(bx, by);
            context.stroke();
          }
        }

        context.fillStyle = "rgba(58,158,217,0.15)";
        context.beginPath();
        context.arc(ax, ay, a.radius, 0, Math.PI * 2);
        context.fill();
      }

      frame = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, width, height);
    };
  }, [isDesktop, reduced]);

  return null;
}

function HorizontalCollectionScroll() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const progress = useMotionValue(0);
  const [distance, setDistance] = useState(0);
  const x = useTransform(progress, [0, 1], [0, -distance]);

  useEffect(() => {
    if (reduced || !isDesktop) return;
    const section = document.getElementById("collection");
    const track = document.querySelector<HTMLElement>(".collection-track");
    if (!section || !track) return;

    const update = () => {
      const travel = Math.max(0, track.scrollWidth - section.clientWidth);
      setDistance(travel);
      section.style.minHeight = `${window.innerHeight + travel + 420}px`;
    };
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, section.offsetHeight - window.innerHeight);
      progress.set(Math.min(1, Math.max(0, -rect.top / total)));
    };

    update();
    onScroll();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", onScroll);
      section.style.minHeight = "";
      track.style.transform = "";
    };
  }, [isDesktop, progress, reduced]);

  useEffect(() => {
    if (reduced || !isDesktop) return;
    const track = document.querySelector<HTMLElement>(".collection-track");
    if (!track) return;
    const unsubscribe = x.on("change", (value) => {
      track.style.transform = `translate3d(${value}px, 0, 0)`;
    });
    return unsubscribe;
  }, [isDesktop, reduced, x]);

  return null;
}

function AnimatedCounters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView || reduced) return;

    document.querySelectorAll<HTMLElement>(".stats-bar strong").forEach((element) => {
      const target = Number(element.dataset.countTo);
      if (!Number.isFinite(target)) return;

      const suffix = element.dataset.countSuffix || "";
      const decimals = target % 1 === 0 ? 0 : 2;
      animate(0, target, {
        type: "spring",
        stiffness: 85,
        damping: 12,
        mass: 0.9,
        restDelta: 0.001,
        onUpdate: (latest) => {
          element.textContent = `${latest.toFixed(decimals)}${suffix}`;
        },
      });
    });
  }, [inView, reduced]);

  return <div ref={ref} style={{ position: "absolute", pointerEvents: "none" }} />;
}

function WaterRipples() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const buttons = document.querySelectorAll<HTMLElement>(".button");
    const handlers: Array<() => void> = [];

    buttons.forEach((button) => {
      button.style.overflow = "hidden";
      const onClick = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement("span");
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.22);width:4px;height:4px;left:${event.clientX - rect.left}px;top:${event.clientY - rect.top}px;transform:translate(-50%,-50%) scale(0);pointer-events:none;animation:ripple-expand 0.65s cubic-bezier(0.16,1,0.3,1) forwards;`;
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 750);
      };
      button.addEventListener("click", onClick);
      handlers.push(() => button.removeEventListener("click", onClick));
    });

    if (!document.getElementById("ripple-kf")) {
      const style = document.createElement("style");
      style.id = "ripple-kf";
      style.textContent = "@keyframes ripple-expand { to { transform: translate(-50%,-50%) scale(80); opacity: 0; } }";
      document.head.appendChild(style);
    }

    return () => handlers.forEach((handler) => handler());
  }, [reduced]);

  return null;
}

function MagneticButtons() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduced || !isDesktop) return;
    const buttons = document.querySelectorAll<HTMLElement>(".button-primary");
    const handlers: Array<() => void> = [];

    buttons.forEach((button) => {
      button.style.transition = "transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease";
      const onMove = (event: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) * 0.28;
        const dy = (event.clientY - (rect.top + rect.height / 2)) * 0.28;
        button.style.transform = `translate(${dx}px,${dy}px) scale(1.05)`;
        button.style.boxShadow = "0 20px 48px rgba(58,158,217,0.38)";
      };
      const onLeave = () => {
        button.style.transform = "";
        button.style.boxShadow = "";
      };
      button.addEventListener("mousemove", onMove);
      button.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        button.removeEventListener("mousemove", onMove);
        button.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => handlers.forEach((handler) => handler());
  }, [isDesktop, reduced]);

  return null;
}

function CardTilt() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (reduced || !isDesktop) return;
    const cards = document.querySelectorAll<HTMLElement>(".card");
    const handlers: Array<() => void> = [];

    cards.forEach((card) => {
      card.style.transition = "transform 0.4s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease";
      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.025)`;
        card.style.boxShadow = `${-x * 16}px ${-y * 16}px 40px rgba(58,158,217,0.15), 0 8px 32px rgba(0,0,0,0.4)`;
      };
      const onLeave = () => {
        card.style.transform = "";
        card.style.boxShadow = "";
      };
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => handlers.forEach((handler) => handler());
  }, [isDesktop, reduced]);

  return null;
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
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
    />
  );
}

function SectionReveal() {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const sections = document.querySelectorAll<HTMLElement>(".section, .stats-bar, .collection-section");
    sections.forEach((section) => {
      section.style.opacity = "0";
      section.style.transform = "translateY(40px)";
      section.style.transition = "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)";
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
        observer.unobserve(element);
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [reduced]);

  return null;
}

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
    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX / window.innerWidth);
      mouseY.set(event.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, reduced]);

  useEffect(() => {
    if (reduced) return;
    return cp1x.on("change", () => {
      setD(`M0,50 C${cp1x.get().toFixed(1)},${cp1y.get().toFixed(1)} ${cp2x.get().toFixed(1)},${cp2y.get().toFixed(1)} 100,50 L100,100 L0,100 Z`);
    });
  }, [cp1x, cp1y, cp2x, cp2y, reduced]);

  if (reduced) return null;

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

export default function AnimationLayer() {
  const magneticLinks = useMemo(() => <MagneticNavLinks />, []);

  return (
    <>
      <SmoothScroll />
      <AnimatedGradientBackground />
      <ScrollProgressBar />
      <NavScroller />
      <HeroParallax />
      <HeroStaggerEntrance />
      <TextScramble />
      {magneticLinks}
      <ParticleField />
      <HorizontalCollectionScroll />
      <AnimatedCounters />
      <MagneticButtons />
      <WaterRipples />
      <CardTilt />
      <SectionReveal />
      <InteractiveWave />
    </>
  );
}
