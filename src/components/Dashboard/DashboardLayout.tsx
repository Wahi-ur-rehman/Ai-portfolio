import React, { useState, useEffect, useRef } from 'react';
import TerminalPanel from './TerminalPanel';
import ContentPanel from './ContentPanel';

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
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const animateCursor = () => {
      const lerp = 0.08;
      smoothedPos.current.x += (mousePos.current.x - smoothedPos.current.x) * lerp;
      smoothedPos.current.y += (mousePos.current.y - smoothedPos.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${smoothedPos.current.x}px, ${smoothedPos.current.y}px, 0)`;
      }
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const animationFrame = requestAnimationFrame(animateCursor);
    
    // ── Intersection Observer for Scroll Sync ──
    const observerOptions = {
      root: containerRef.current?.querySelector('.content-view-wrapper'),
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id as Section);
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section-container');
    sections.forEach((section) => observer.observe(section));

    const timer = setTimeout(() => setIsBooting(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
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
        <div className="content-panel-wrapper animate-slide-in">
          <ContentPanel activeSection={activeSection} />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
