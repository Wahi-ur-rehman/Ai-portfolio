import React, { useState, useEffect, useRef } from 'react';
import TerminalPanel from './TerminalPanel';
import ContentPanel from './ContentPanel';
import Background3D from './Background3D';

type Section = 'overview' | 'projects' | 'experience' | 'skills';

const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [isBooting,     setIsBooting]     = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef    = useRef<HTMLDivElement>(null);
  const mousePos     = useRef({ x: -100, y: -100 });
  const smoothedPos  = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // ── Cursor Smoothing (Lerp) ──
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      const lerp = 0.12; // Increased speed for snappier feel
      smoothedPos.current.x += (mousePos.current.x - smoothedPos.current.x) * lerp;
      smoothedPos.current.y += (mousePos.current.y - smoothedPos.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${smoothedPos.current.x}px, ${smoothedPos.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    rafId = requestAnimationFrame(animateCursor);
    
    // ── Intersection Observer for Scroll Sync ──
    const wrapper = containerRef.current?.querySelector('.content-view-wrapper');
    const observerOptions = {
      root: wrapper,
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id as Section;
          setActiveSection(id);
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section-container');
    sections.forEach((section) => observer.observe(section));

    const timer = setTimeout(() => setIsBooting(false), 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="dashboard-layout" ref={containerRef}>
      
      {/* ── Cursor Glow (Smoothed) ── */}
      <div 
        className="cursor-glow" 
        ref={cursorRef}
        style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none' }}
      />

      {/* ── Boot Identity Scan ── */}
      {isBooting && <div className="identity-scan-bar" />}

      {/* ── 3D Decorative Node Graph ── */}
      <Background3D />

      {/* ── Pure CSS neural grid background ── */}
      <div className="neural-bg" aria-hidden="true" />

      {/* ── Mobile drawer toggle ── */}
      <button
        className="drawer-toggle magnetic"
        onClick={() => setDrawerOpen(o => !o)}
        aria-label={drawerOpen ? 'Close terminal' : 'Open terminal'}
      >
        {drawerOpen ? '✕' : '⌨'}
      </button>

      {/* ── Split-screen UI ── */}
      <div className="dashboard-ui">

        {/* Left: terminal */}
        <div className={`terminal-wrapper ${drawerOpen ? 'drawer-open' : ''}`}>
          <div className="drawer-handle" onClick={() => setDrawerOpen(o => !o)} />
          <TerminalPanel
            activeSection={activeSection}
            setActiveSection={(s) => {
              setActiveSection(s);
              document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>

        {/* Right: content */}
        <ContentPanel activeSection={activeSection} />

      </div>
    </div>
  );
};

export default DashboardLayout;
