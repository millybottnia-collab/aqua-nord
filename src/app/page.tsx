// Server Component — renders all content as plain HTML immediately.
// AnimationLayer is a separate client chunk loaded after JS parses.
import { Suspense } from "react";
import AnimationLayer from "@/components/AnimationLayer";

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
    description:
      "We map your source water profile and usage patterns before recommending a system.",
  },
  {
    number: "02",
    title: "Purify",
    description:
      "Layered membranes and carbon media remove contaminants with quiet precision.",
  },
  {
    number: "03",
    title: "Maintain",
    description:
      "Smart filter tracking keeps quality stable with timely service and replacements.",
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

export default function Home() {
  return (
    <main className="site-shell">
      {/* Nav */}
      <nav className="nav" id="nav-root">
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
        <a className="button button-primary nav-cta" href="#contact">
          Book consult
        </a>
      </nav>

      {/* Hero */}
      <section id="top" className="hero">
        {/* Parallax background image */}
        <div className="hero-bg-wrap" aria-hidden="true">
          <div
            id="hero-bg-layer"
            className="hero-bg-img"
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          />
          <div id="hero-overlay" className="hero-bg-overlay" />
        </div>

        <div className="hero-copy">
          <p className="badge">Scandinavian water purification</p>
          <h1>Pure water, engineered for quiet luxury.</h1>
          <p className="hero-text">
            Aqua Nord brings precise Nordic filtration into refined homes,
            balancing measurable purity with calm, minimal design.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#contact">
              Design my system
            </a>
            <a className="button button-ghost" href="#process">
              See the process
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <svg className="water-ring" viewBox="0 0 520 520">
            <defs>
              <linearGradient id="aquaLine" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#3a9ed9" />
                <stop offset="1" stopColor="#2dd4a4" />
              </linearGradient>
            </defs>
            <circle cx="260" cy="260" r="190" />
            <path d="M104 268c54-78 105 74 161-3s102-16 151-23" />
            <path d="M135 329c41-47 83 34 132-12s87-15 116-9" />
          </svg>
          <div className="water-drop" />
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar" aria-label="Key statistics">
        {stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="purity" className="section">
        <div className="section-header">
          <p className="badge">Purity system</p>
          <h2>Filtration that disappears into daily life.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="card feature-card" key={feature.title}>
              <div className="icon-shell">
                <Icon type={feature.icon} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="section">
        <div className="section-header">
          <p className="badge">How it works</p>
          <h2>Three clear steps from source to glass.</h2>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <article className="step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="stories" className="section">
        <div className="section-header">
          <p className="badge">Testimonials</p>
          <h2>Specified by people who notice details.</h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure className="card testimonial" key={testimonial.name}>
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="section">
        <div className="cta">
          <p className="badge">Private consultation</p>
          <h2>Bring Nordic-grade water into your home.</h2>
          <p>
            Start with a source-water analysis and receive a discreet system
            plan built around your space, pressure, and taste profile.
          </p>
          <a className="button button-primary" href="mailto:studio@aquanord.example">
            Request analysis
          </a>
        </div>
      </section>

      {/* Footer */}
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

      {/* Animations: client-only, loads after content is visible */}
      <Suspense fallback={null}>
        <AnimationLayer />
      </Suspense>
    </main>
  );
}
