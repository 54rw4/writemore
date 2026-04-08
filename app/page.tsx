'use client';
import React, { useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

// Section titles and ids for navigation and tracking
const sections = [
  { id: "hero", title: "Hero" },
  { id: "problem", title: "Problem" },
  { id: "how-might-we", title: "How Might We" },
  { id: "research", title: "Research" },
  { id: "key-findings", title: "Key Findings" },
  { id: "process", title: "Process" },
  { id: "proposal", title: "Proposal" },
  { id: "solution", title: "Solution" },
  { id: "testing", title: "Testing & Iteration" },
  { id: "outcome", title: "Final Outcome" },
  { id: "video", title: "Video" },
  { id: "reflection", title: "Reflection" },
];

// Util for scrollspy / active section tracking
function useScrollSpy(sectionIds, offset = 100) {
  const [active, setActive] = React.useState(sectionIds[0]);
  React.useEffect(() => {
    function onScroll() {
      let lastSection = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (window.scrollY + offset >= el.offsetTop) lastSection = id;
      }
      setActive(lastSection);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionIds]);
  return active;
}

// Framer Motion variants for fade-in + upward motion
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Table of Contents Component
function TableOfContents({ sections, activeSection, onClose }) {
  return (
    <nav
      className="
        hidden md:flex
        flex-col gap-2 py-8 px-4
        sticky top-0
        h-screen
        text-sm text-gray-700
        w-56
        min-w-[160px]
        font-medium
        "
      aria-label="Table of Contents"
    >
      <span className="uppercase tracking-widest text-xs mb-2 text-gray-400">
        Sections
      </span>
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`block rounded px-2 py-1 transition-colors group
            ${
              activeSection === section.id
                ? "bg-gray-100 text-black font-semibold"
                : "hover:bg-gray-50"
            }
          `}
        >
          {section.title}
          {activeSection === section.id && (
            <span className="ml-1 h-2 w-2 inline-block rounded-full bg-blue-500 align-middle" />
          )}
        </a>
      ))}
    </nav>
  );
}

// Mobile TOC (dropdown)
function MobileTOC({ sections, activeSection }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed z-40 top-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center">
        <button
          aria-label="Open sections menu"
          className="rounded p-1 hover:bg-gray-100 focus:bg-gray-100 text-gray-600"
          onClick={() => setOpen((v) => !v)}
        >
          <svg height={24} width={24} fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x={4} y={8} width={16} height={2} rx={1} />
            <rect x={4} y={14} width={16} height={2} rx={1} />
          </svg>
        </button>
        <span className="ml-3 text-sm font-medium">
          {sections.find((s) => s.id === activeSection)?.title || ""}
        </span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: -32, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            className="absolute left-0 w-full shadow-lg bg-white border-t border-gray-100"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block px-6 py-3 border-b border-gray-50 ${
                  activeSection === section.id ? "bg-blue-50 text-blue-700 font-semibold" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {section.title}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Section Wrapper for animation and spacing
function Section({ id, children }) {
  const controls = useAnimation();
  const ref = useRef();

  React.useEffect(() => {
    function onScroll() {
      if (!ref.current) return;
      const { top } = ref.current.getBoundingClientRect();
      if (top < window.innerHeight - 120) controls.start("visible");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [controls]);

  return (
    <section
      id={id}
      ref={ref}
      className="my-14 scroll-mt-24"
      aria-labelledby={id + "-title"}
    >
      <motion.div initial="hidden" animate={controls} variants={fadeUp}>
        {children}
      </motion.div>
    </section>
  );
}

// Tag component for research methods
function Tag({ children }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2">
      {children}
    </span>
  );
}

// Timeline / Steps for Process
function Timeline({ steps }) {
  return (
    <ol className="relative border-l border-gray-200 pl-6">
      {steps.map((step, idx) => (
        <li key={step.label} className="mb-6 last:mb-0">
          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full border border-blue-400 text-blue-700 font-bold text-xs">
            {idx + 1}
          </span>
          <div className="ml-2">
            <div className="font-semibold text-gray-900 text-sm">{step.label}</div>
            <div className="text-xs text-gray-500 mt-1">{step.desc}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// Mock UI card for solution (simplified)
function MockUICard({ title, children }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 max-w-[350px] mx-auto flex flex-col gap-2 mb-6">
      <div className="font-semibold mb-1 text-gray-800">{title}</div>
      <div className="text-sm text-gray-500">{children}</div>
    </div>
  );
}

export default function WriteMoreCaseStudy() {
  const activeSection = useScrollSpy(sections.map((s) => s.id));

  return (
    <div
      className="font-sans min-h-screen text-gray-900 bg-white"
      style={{ fontFamily: "'Inter', 'SF Pro Display', Arial, sans-serif" }}
    >
      {/* Mobile TOC */}
      <MobileTOC sections={sections} activeSection={activeSection} />

      {/* Layout container */}
      <div className="flex max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-0">
        {/* Desktop TOC Sidebar */}
        <div className="hidden md:block flex-shrink-0 w-56 min-w-[160px]">
          <TableOfContents sections={sections} activeSection={activeSection} />
        </div>
        {/* Main content */}
        <main className="flex-1 max-w-2xl mx-auto md:mx-0">
          {/* 1. Hero */}
          <Section id="hero">
            <h1
              id="hero-title"
              className="text-[2.6rem] leading-tight font-extrabold mb-4"
              style={{ letterSpacing: "-.03em" }}
            >
              Write More
            </h1>
            <h2 className="text-xl md:text-2xl mb-2 font-medium text-gray-700 max-w-prose">
              A UX case study on helping busy and self-doubting writers build consistent writing habits
            </h2>
            <div className="text-lg text-gray-500 mt-2 max-w-prose">
              Elevating the joy of progress for every kind of writer.
            </div>
          </Section>

          {/* 2. Problem */}
          <Section id="problem">
            <h2 id="problem-title" className="font-semibold text-lg mb-2">
              Problem
            </h2>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <div className="text-[1.35rem] leading-snug font-bold mb-2 bg-blue-50 p-4 rounded-lg text-blue-800 shadow-sm">
                  “Fewer than <span className="font-extrabold text-blue-700">15%</span> of scholars become productive writers, often reporting they are too busy”
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[1.35rem] leading-snug font-bold mb-2 bg-blue-50 p-4 rounded-lg text-blue-800 shadow-sm">
                  “Over <span className="font-extrabold text-blue-700">60%</span> of writers experience self-doubt about their work”
                </div>
              </div>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mt-2">
              <li>People feel they need large uninterrupted time</li>
              <li>Writing must feel meaningful to count</li>
            </ul>
          </Section>

          {/* 3. How Might We */}
          <Section id="how-might-we">
            <h2 id="how-might-we-title" className="font-semibold text-lg mb-3">
              How Might We
            </h2>
            <div className="text-xl md:text-2xl font-bold leading-snug text-blue-800 bg-blue-50 p-4 rounded-lg max-w-xl">
              Design a storytelling platform that makes it effortless and motivating for busy or uncertain writers to start and continue writing
            </div>
          </Section>

          {/* 4. Research */}
          <Section id="research">
            <h2 id="research-title" className="font-semibold text-lg mb-3">
              Research
            </h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {[
                "competitive analysis",
                "social posts",
                "empathy maps",
                "popular media analysis",
                "user interviews",
                "design principles",
              ].map((m) => (
                <Tag key={m}>{m}</Tag>
              ))}
            </div>
            <div className="text-gray-600 text-sm max-w-prose">
              A mix of qualitative and quantitative approaches revealed deep-seated beliefs, environmental triggers, and motivation blockers among writers.
            </div>
          </Section>

          {/* 5. Key Findings */}
          <Section id="key-findings">
            <h2 id="key-findings-title" className="font-semibold text-lg mb-3">
              Key Findings
            </h2>
            <div className="space-y-5">
              <div>
                <div className="font-bold text-base mb-1">Most writers over-prepare instead of simply starting</div>
                <div className="text-gray-600 text-sm">
                  Perfectionism often stops progress before it begins.
                </div>
              </div>
              <div>
                <div className="font-bold text-base mb-1">Short, visible progress boosts motivation</div>
                <div className="text-gray-600 text-sm">
                  Writers want to see their work “add up” each session.
                </div>
              </div>
              <div>
                <div className="font-bold text-base mb-1">Community support is quietly powerful</div>
                <div className="text-gray-600 text-sm">Gentle encouragement helps build consistency.</div>
              </div>
              <div>
                <div className="font-bold text-base mb-1">AI can lower the starting barrier</div>
                <div className="text-gray-600 text-sm">Writers are curious about smart, not generic, prompts.</div>
              </div>
              <div>
                <div className="font-bold text-base mb-1">Little wins matter more than big streaks</div>
                <div className="text-gray-600 text-sm">
                  Small celebrations fuel habit formation better than gamified pressure.
                </div>
              </div>
            </div>
          </Section>

          {/* 6. Process */}
          <Section id="process">
            <h2 id="process-title" className="font-semibold text-lg mb-3">
              Process
            </h2>
            <Timeline
              steps={[
                { label: "Crazy 8s", desc: "Quick ideation sketches" },
                { label: "Trend Analysis", desc: "Surveyed adjacent habits apps" },
                { label: "User Needs", desc: "Pinpointed writer goals" },
                { label: "Analogous Research", desc: "Studied non-writing disciplines" },
                { label: "Low-Fi Prototype", desc: "Early flows, quick validation" },
                { label: "Research Plan", desc: "Structured interviews & testing" },
                { label: "Co-creation", desc: "Brainstormed with real writers" },
                { label: "Feature Prioritization", desc: "Stack-ranked MVP scope" },
                { label: "5 Whys", desc: "Root cause exploration" },
                { label: "Affinity Mapping", desc: "Grouped feedback themes" },
                { label: "Iteration", desc: "Refined with feedback" },
              ]}
            />
          </Section>

          {/* 7. Proposal */}
          <Section id="proposal">
            <h2 id="proposal-title" className="font-semibold text-lg mb-3">
              Proposal
            </h2>
            <div className="text-gray-800 text-base max-w-prose mb-2">
              A platform designed for busy, self-doubting writers to start quickly, set achievable goals, and build confidence. Features include instant writing, SMART goal-setting, gentle AI prompts, optional community engagement, and a subtle reward system inspired by Braille dots.
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Quick start writing</li>
              <li>SMART goals</li>
              <li>AI nudges</li>
              <li>Optional community</li>
              <li>Braille reward system</li>
            </ul>
          </Section>

          {/* 8. Solution — Show 4 simple UI mock cards */}
          <Section id="solution">
            <h2 id="solution-title" className="font-semibold text-lg mb-3">
              Solution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
              <MockUICard title="Homepage">
                <div className="flex flex-col gap-2">
                  <span className="block h-6 w-2/3 bg-gray-200 rounded mb-2" />
                  <span className="block h-3 w-1/2 bg-gray-100 rounded" />
                  <span className="block h-3 w-1/3 bg-gray-100 rounded" />
                  <button className="mt-2 px-5 py-2 rounded bg-blue-500 text-white text-sm font-medium shadow">
                    Start Writing
                  </button>
                </div>
              </MockUICard>
              <MockUICard title="Writing Interface">
                <div className="flex flex-col gap-2">
                  <span className="block h-3 w-2/5 bg-gray-100 rounded" />
                  <textarea
                    readOnly
                    className="rounded border border-gray-200 w-full h-16 p-2 bg-gray-50"
                    placeholder="Write here…"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-gray-200 rounded-full px-2 py-1 text-xs">Streak: 4</span>
                    <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs">AI Nudge</span>
                  </div>
                </div>
              </MockUICard>
              <MockUICard title="Goal Setting">
                <div className="flex flex-col gap-2">
                  <span className="block h-3 w-3/5 bg-gray-100 rounded" />
                  <div className="bg-white flex items-center border rounded-md px-3 py-2">
                    <span className="text-gray-400 text-xs mr-2">Word goal:</span>
                    <input className="w-16 bg-transparent outline-none text-gray-900 font-medium" placeholder="500" disabled />
                  </div>
                  <span className="text-xs text-gray-400">Set achievable SMART goals</span>
                </div>
              </MockUICard>
              <MockUICard title="Community">
                <div className="flex flex-col gap-2">
                  <div className="flex -space-x-1 mb-1">
                    <span className="block h-6 w-6 rounded-full bg-gray-200 border-2 border-white" />
                    <span className="block h-6 w-6 rounded-full bg-blue-100 border-2 border-white" />
                    <span className="block h-6 w-6 rounded-full bg-gray-100 border-2 border-white" />
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Celebrate progress with others</div>
                  <button className="rounded px-4 py-1 bg-blue-500 text-white text-xs font-medium self-start shadow">
                    Join Conversation
                  </button>
                </div>
              </MockUICard>
            </div>
            <div className="flex gap-2 mt-4 text-gray-400 text-xs">
              <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
              <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
              <span className="inline-block h-3 w-3 rounded-full bg-blue-400" />
              <span className="inline-block h-3 w-3 rounded-full bg-gray-200" />
            </div>
          </Section>

          {/* 9. Testing & Iteration */}
          <Section id="testing">
            <h2 id="testing-title" className="font-semibold text-lg mb-3">
              Testing & Iteration
            </h2>
            <ul className="list-disc pl-6 text-gray-700 mb-2">
              <li>
                <strong>2 rounds usability testing</strong> – Iterative feedback after each major prototype
              </li>
              <li>
                <strong>Mid-fi → Hi-fi progression</strong> – Increased polish, simplified navigation
              </li>
              <li>
                <strong>Key improvements:</strong> Clearer call-to-action, lighter interface, more nudges, easier onboarding
              </li>
            </ul>
          </Section>

          {/* 10. Final Outcome */}
          <Section id="outcome">
            <h2 id="outcome-title" className="font-semibold text-lg mb-3">
              Final Outcome
            </h2>
            <div className="text-gray-800 text-base">
              “Write More” enabled over two-thirds of test users to increase their weekly writing frequency, with reported boosts to confidence and enjoyment. The minimalist, encouraging approach made consistency easier than ever.
            </div>
          </Section>

          {/* 11. Video */}
          <Section id="video">
            <h2 id="video-title" className="font-semibold text-lg mb-3">
              Video
            </h2>
            <div className="flex justify-center">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-2 shadow-sm w-full max-w-lg aspect-video flex items-center justify-center">
                <span className="text-gray-400 text-xl">[ Pitch Video Placeholder ]</span>
              </div>
            </div>
          </Section>

          {/* 12. Reflection */}
          <Section id="reflection">
            <h2 id="reflection-title" className="font-semibold text-lg mb-3">
              Reflection
            </h2>
            <div className="text-gray-700 text-base mb-2">
              This case study strengthened my belief in reducing friction for users and focusing on tiny, uplifting moments. Next, I’d explore more personalized AI support and lightweight progress-sharing to further help self-doubting writers.
            </div>
            <div className="text-xs text-gray-400">
              Project by [Your Name].<br />
              Last updated June 2024.
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}

