import React, { useState, useEffect, useRef } from 'react';
import TerminalPanel from './TerminalPanel';
import ContentPanel from './ContentPanel';
import Background3D from './Background3D';
import CustomCursor from '../Effects/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';

type Section = 'overview' | 'projects' | 'experience' | 'skills';

const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [isBooting,     setIsBooting]     = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Intersection Observer for Scroll Sync ──
    const wrapper = containerRef.current?.querySelector('.content-view-wrapper');
    const observerOptions = {
      root: wrapper,
      threshold: 0.3,
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

    // Handle Keyboard Shortcuts
    const handleKey = (e: KeyboardEvent) => {
       if (e.key === '~' || e.key === '`') {
          setDrawerOpen(prev => !prev);
          // Focus terminal input if opening
          setTimeout(() => {
             const input = document.querySelector('.terminal-input') as HTMLInputElement;
             input?.focus();
          }, 100);
       }
    };
    window.addEventListener('keydown', handleKey);

    const timer = setTimeout(() => setIsBooting(false), 2000);

    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', handleKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="dashboard-layout" ref={containerRef}>
      
      <CustomCursor />

      {/* ── Boot Identity Scan ── */}
      <AnimatePresence>
        {isBooting && (
          <motion.div 
            className="identity-scan-bar" 
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <Background3D />

      <div className="neural-bg" aria-hidden="true" />

      {/* ── Mobile drawer toggle ── */}
      <button
        className="drawer-toggle magnetic"
        onClick={() => setDrawerOpen(o => !o)}
        aria-label={drawerOpen ? 'Close terminal' : 'Open terminal'}
      >
        {drawerOpen ? '✕' : <span style={{ fontSize: '1.4rem' }}>⌨</span>}
      </button>

      {/* ── Split-screen UI ── */}
      <div className="dashboard-ui">

        {/* Left: terminal */}
        <motion.div 
           className={`terminal-wrapper ${drawerOpen ? 'drawer-open' : ''}`}
           initial={{ x: -20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="drawer-handle" onClick={() => setDrawerOpen(o => !o)} />
          <TerminalPanel
            activeSection={activeSection}
            setActiveSection={(s) => {
              setActiveSection(s);
              document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </motion.div>

        {/* Right: content */}
        <motion.div 
           style={{ flex: 1, minWidth: 0, height: '100%' }}
           initial={{ x: 20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ContentPanel activeSection={activeSection} />
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardLayout;
