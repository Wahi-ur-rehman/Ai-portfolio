import React, { useState } from 'react';
import TerminalPanel from './TerminalPanel';
import ContentPanel from './ContentPanel';

type Section = 'overview' | 'projects' | 'experience' | 'skills';

const DashboardLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [drawerOpen,    setDrawerOpen]    = useState(false);

  return (
    <div className="dashboard-layout">

      {/* ── Pure CSS neural grid background ── */}
      <div className="neural-bg" aria-hidden="true" />

      {/* ── Mobile drawer toggle ── */}
      <button
        className="drawer-toggle"
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
        <ContentPanel activeSection={activeSection} />

      </div>
    </div>
  );
};

export default DashboardLayout;
