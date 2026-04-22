import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const focusAreas = [
  {
    icon: '🤖',
    title: 'AI & Machine Learning',
    desc: 'Building intelligent systems with TensorFlow, Scikit-learn, and real-world data pipelines.',
  },
  {
    icon: '⚡',
    title: 'Automation',
    desc: 'End-to-end workflow automation via n8n, API integrations, and task orchestration.',
  },
  {
    icon: '🎨',
    title: '3D Visual Design',
    desc: 'Exploring creative extensions through 3D modeling and interactive visual experiences.',
  },
];

const OverviewView: React.FC = () => {
  const introParagraph = portfolioData.bio.split('\n\n')[0];

  return (
    <div className="view-container">
      <h1 className="view-title">Overview</h1>

      {/* ── Intro card ─────────────────────────────── */}
      <div className="overview-intro-card">
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

      {/* ── Focus areas ────────────────────────────── */}
      <div className="section-label">Focus Areas</div>
      <div className="focus-areas-grid">
        {focusAreas.map((area, i) => (
          <div key={i} className="focus-card">
            <span className="focus-icon">{area.icon}</span>
            <h3 className="focus-title">{area.title}</h3>
            <p className="focus-desc">{area.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Tech snapshot ──────────────────────────── */}
      <div className="section-label">Tech Snapshot</div>
      <div className="snapshot-grid">
        {portfolioData.skills.slice(0, 3).map((group, i) => (
          <div key={i} className="snapshot-group">
            <span className="snapshot-label">{group.category}</span>
            <div className="snapshot-tags">
              {group.items.slice(0, 4).map((item, j) => (
                <span key={j} className="skill-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewView;
