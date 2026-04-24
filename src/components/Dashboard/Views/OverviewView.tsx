import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const focusAreas = [
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    desc: 'Engineering autonomous agents and predictive models with architectural precision.',
  },
  {
    icon: '⚡',
    title: 'Scalable Automation',
    desc: 'Designing enterprise-grade pipelines that eliminate friction and maximize output.',
  },
  {
    icon: '💠',
    title: '3D Human-AI Interface',
    desc: 'Creating immersive visual gateways to represent complex system logic.',
  },
];

const OverviewView: React.FC = () => {
  const introParagraph = portfolioData.bio.split('\n\n')[0];

  return (
    <div className="view-container">
      <h1 className="view-title">System Overview</h1>

      {/* ── Intro card with depth ── */}
      <div className="overview-intro-card depth-hover">
        <div className="overview-header">
          <img
            src={portfolioData.profileImage}
            alt={portfolioData.name}
            className="profile-img"
          />
          <div className="overview-title-section">
            <h2 className="overview-name">{portfolioData.name}</h2>
            <div className="overview-titles">
              {portfolioData.titles.map((t, i) => (
                <span key={i} className="title-badge">{t}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="bio-paragraph">{introParagraph}</p>
      </div>

      {/* ── Metrics Grid ── */}
      <div className="section-label">Performance Metrics</div>
      <div className="snapshot-grid">
        {(portfolioData as any).metrics?.map((m: any, i: number) => (
          <div key={i} className="snapshot-group depth-hover" style={{ textAlign: 'center' }}>
            <span className="snapshot-label" style={{ marginBottom: '0.2rem' }}>{m.label}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Focus areas ── */}
      <div className="section-label">Core Specializations</div>
      <div className="focus-areas-grid">
        {focusAreas.map((area, i) => (
          <div key={i} className="focus-card depth-hover">
            <span className="focus-icon">{area.icon}</span>
            <h3 className="focus-title">{area.title}</h3>
            <p className="focus-desc">{area.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Tech snapshot ── */}
      <div className="section-label">Technical Proof</div>
      <div className="snapshot-grid">
        {portfolioData.skills.slice(0, 3).map((group, i) => (
          <div key={i} className="snapshot-group depth-hover">
            <span className="snapshot-label">{group.category}</span>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
               {group.items.slice(0, 2).map((item, j) => (
                 <li key={j} style={{ marginBottom: '0.4rem' }}>• {item}</li>
               ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewView;
