"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const navLinks = ["Purity", "Process", "Stories", "Contact"];

const stats = [
  { value: "99.97%", label: "Certified purity" },
  { value: "120+", label: "Countries served" },
  { value: "25 yrs", label: "Nordic engineering" },
];

const features = [
  {
    title: "Arctic carbon core",
    description:
      "Multi-stage carbon filtration removes chlorine, sediment, and micro-particles while preserving a clean mineral profile.",
    icon: "core",
  },
  {
    title: "Continuous purity sensing",
    description:
      "Inline sensors monitor water quality in real time and alert you before performance drops.",
    icon: "sense",
  },
  {
    title: "Low-waste flow design",
    description:
      "A pressure-balanced system minimizes wastewater without compromising taste or throughput.",
    icon: "flow",
  },
];

const steps = [
  {
    number: "01",
    title: "Analyze",
    description: "We map your source water profile and usage patterns before recommending a system.",
  },
  {
    number: "02",
    title: "Purify",
    description: "Layered membranes and carbon media remove contaminants with quiet precision.",
  },
  {
    number: "03",
    title: "Maintain",
    description: "Smart filter tracking keeps quality stable with timely service and replacements.",
  },
];

const testimonials = [
  {
    quote:
      "Aqua Nord made our kitchen water taste like a mountain spring, without adding visual noise to the space.",
    name: "Maja Lindholm",
    role: "Interior architect, Stockholm",
  },
  {
    quote:
      "The installation was precise, the monitoring is clear, and the water quality has stayed consistent for months.",
    name: "Erik Nygaard",
    role: "Founder, Fjord House",
  },
  {
    quote:
      "It feels engineered, not ornamented. That restraint is exactly why we specify it in premium residences.",
    name: "Sofia Berg",
    role: "Residential developer",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Icon({ type }: { type: string }) {
  if (type === "sense") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="13" />
        <path d="M24 5v7M24 36v7M5 24h7M36 24h7" />
        <path d="m14 14 5 5M34 14l-5 5M14 34l5-5M34 34l-5-5" />
      </svg>
    );
  }

  if (type === "flow") {
    return (
      <svg aria-hidden="true" viewBox="0 0 48 48">
        <path d="M7 28c8-10 14 10 22 0s12-1 12-1" />
        <path d="M7 18c8-10 14 10 22 0s12-1 12-1" />
        <path d="M34 12h7v7" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 48 48">
      <path d="M24 5c7 8 14 15 14 25a14 14 0 0 1-28 0C10 20 17 13 24 5Z" />
      <path d="M17 30a7 7 0 0 0 12 5" />
    </svg>
  );
}

function MotionSection({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section">
      <motion.div
        className="section-header"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="badge">{eyebrow}</p>
        <h2>{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const navBackground = useTransform(
    scrollY,
    [0, 96],
    ["rgba(10, 13, 15, 0.72)", "rgba(10, 13, 15, 0.94)"],
  );
  const navBorder = useTransform(
    scrollY,
    [0, 96],
    ["rgba(30, 37, 41, 0)", "rgba(30, 37, 41, 1)"],
  );

  return (
    <main className="site-shell">
      <motion.nav
        className="nav"
        style={{ backgroundColor: navBackground, borderColor: navBorder }}
      >
        <a className="brand" href="#top" aria-label="Aqua Nord home">
          <span className="brand-mark" />
          Aqua Nord
        </a>
        <div className="nav-links" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`}>
              {link}
            </a>
          ))}
        </div>
        <motion.a
          className="button button-primary nav-cta"
          href="#contact"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          Book consult
        </motion.a>
      </motion.nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <motion.p
            className="badge"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Scandinavian water purification
          </motion.p>
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            Pure water, engineered for quiet luxury.
          </motion.h1>
          <motion.p
            className="hero-text"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            Aqua Nord brings precise Nordic filtration into refined homes,
            balancing measurable purity with calm, minimal design.
          </motion.p>
          <motion.div
            className="hero-actions"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <motion.a
              className="button button-primary"
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              Design my system
            </motion.a>
            <motion.a
              className="button button-ghost"
              href="#process"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              See the process
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          aria-hidden="true"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
        >
          <motion.svg
            className="water-ring"
            viewBox="0 0 520 520"
            animate={prefersReducedMotion ? {} : { rotate: 360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          >
            <defs>
              <linearGradient id="aquaLine" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#3a9ed9" />
                <stop offset="1" stopColor="#2dd4a4" />
              </linearGradient>
            </defs>
            <circle cx="260" cy="260" r="190" />
            <path d="M104 268c54-78 105 74 161-3s102-16 151-23" />
            <path d="M135 329c41-47 83 34 132-12s87-15 116-9" />
          </motion.svg>
          <motion.div
            className="water-drop"
            animate={prefersReducedMotion ? {} : { y: [0, -16, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      <motion.section
        className="stats-bar"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeInUp} transition={{ duration: 0.6 }}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      <MotionSection id="purity" eyebrow="Purity system" title="Filtration that disappears into daily life.">
        <motion.div
          className="feature-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {features.map((feature) => (
            <motion.article
              className="card feature-card"
              key={feature.title}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="icon-shell">
                <Icon type={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </MotionSection>

      <MotionSection id="process" eyebrow="How it works" title="Three clear steps from source to glass.">
        <motion.div
          className="steps"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {steps.map((step) => (
            <motion.article
              className="step"
              key={step.number}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </MotionSection>

      <MotionSection id="stories" eyebrow="Testimonials" title="Specified by people who notice details.">
        <motion.div
          className="testimonial-grid"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {testimonials.map((testimonial) => (
            <motion.figure
              className="card testimonial"
              key={testimonial.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </MotionSection>

      <section id="contact" className="section">
        <motion.div
          className="cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="badge">Private consultation</p>
          <h2>Bring Nordic-grade water into your home.</h2>
          <p>
            Start with a source-water analysis and receive a discreet system
            plan built around your space, pressure, and taste profile.
          </p>
          <motion.a
            className="button button-primary"
            href="mailto:studio@aquanord.example"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            Request analysis
          </motion.a>
        </motion.div>
      </section>

      <footer className="footer">
        <a className="brand" href="#top" aria-label="Aqua Nord home">
          <span className="brand-mark" />
          Aqua Nord
        </a>
        <div className="footer-links">
          <a href="#purity">Purity</a>
          <a href="#process">Process</a>
          <a href="#stories">Stories</a>
          <a href="#contact">Contact</a>
        </div>
        <p>© 2026 Aqua Nord. All rights reserved.</p>
      </footer>
    </main>
  );
}
