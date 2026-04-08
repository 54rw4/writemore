'use client';
import React, { useRef } from "react";
import { motion, useAnimation, AnimatePresence, Transition } from "framer-motion";

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
function useScrollSpy(sectionIds: string[], offset: number = 100) {
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
const fadeUp: { hidden: {}; visible: { opacity: number; y: number; transition: Transition } } = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }, // cubic-bezier for easeOut
  },
};

// Table of Contents Component
interface TOCProps {
  sections: { id: string; title: string }[];
  activeSection: string;
  onClose?: () => void;
}

function TableOfContents({ sections, activeSection }: TOCProps) {
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
interface MobileTOCProps {
  sections: { id: string; title: string }[];
  activeSection: string;
}

function MobileTOC({ sections, activeSection }: MobileTOCProps) {
  const [open, setOpen] = React.useState<boolean>(false);
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
interface SectionProps {
  id: string;
  children: React.ReactNode;
}

function Section({ id, children }: SectionProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLElement>(null);

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
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2">
      {children}
    </span>
  );
}

// Timeline / Steps for Process
interface TimelineStep {
  label: string;
  desc: string;
}
function Timeline({ steps }: { steps: TimelineStep[] }) {
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
interface MockUICardProps {
  title: string;
  children: React.ReactNode;
}
function MockUICard({ title, children }: MockUICardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 max-w-[350px] mx-auto flex flex-col gap-2 mb-6">
      <div className="font-semibold mb-1 text-gray-800">{title}</div>
      <div className="text-sm text-gray-500">{children}</div>
    </div>
  );
}

// Main Case Study Component
export default function WriteMoreCaseStudy() {
  const activeSection = useScrollSpy(sections.map((s) => s.id));

  return (
    <div
      className="font-sans min-h-screen text-gray-900 bg-white"
      style={{ fontFamily: "'Inter', 'SF Pro Display', Arial, sans-serif" }}
    >
      <MobileTOC sections={sections} activeSection={activeSection} />
      <div className="flex max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-0">
        <div className="hidden md:block flex-shrink-0 w-56 min-w-[160px]">
          <TableOfContents sections={sections} activeSection={activeSection} />
        </div>
        <main className="flex-1 max-w-2xl mx-auto md:mx-0">
          {/* Sections go here */}
        </main>
      </div>
    </div>
  );
}

// TypeScript expects type annotations for function parameters by default when 'noImplicitAny' is enabled.
// Fix: add type annotations for 'sectionIds' and 'offset' in useScrollSpy definition (already present above).
// This code block is left intentionally empty because the corrected code is already present in your file.