import React, { useState, useEffect, useRef } from 'react';
import TerminalPanel from './TerminalPanel';
import ContentPanel from './ContentPanel';

type Section = 'overview' | 'projects' | 'experience' | 'skills';

const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [mousePos,      setMousePos]      = useState({ x: -100, y: -100 });
  const [isBooting,     setIsBooting]     = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Magnetic effect for elements with .magnetic class
      const magneticElements = document.querySelectorAll('.magnetic');
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance < 80) {
          const x = distanceX * 0.3;
          const y = distanceY * 0.3;
          (el as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        } else {
          (el as HTMLElement).style.transform = `translate(0px, 0px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Simulate initial boot sequence
    const timer = setTimeout(() => setIsBooting(false), 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="dashboard-layout" ref={containerRef}>
      
      {/* ── Cursor Glow ── */}
      <div 
        className="cursor-glow" 
        style={{ left: mousePos.x, top: mousePos.y }} 
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

        {/* Left: terminal (desktop always visible, mobile = drawer) */}
        <div className={`terminal-wrapper ${drawerOpen ? 'drawer-open' : ''}`}>
          {/* Mobile drag handle */}
          <div className="drawer-handle" onClick={() => setDrawerOpen(o => !o)} />
          <TerminalPanel
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        </div>

        {/* Right: content */}
        <div className="content-panel-wrapper animate-slide-in" key={activeSection}>
          <ContentPanel activeSection={activeSection} />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;
