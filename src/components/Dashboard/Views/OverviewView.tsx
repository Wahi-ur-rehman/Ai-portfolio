import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

const AnimatedCounter = ({ value, suffix }: { value: string, suffix: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const target = parseInt(value);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setDisplayValue(target);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <>{displayValue}{suffix}</>;
};

const OverviewView: React.FC = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = portfolioData.titles[roleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting && displayText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % portfolioData.titles.length);
      } else {
        setDisplayText(currentRole.substring(0, isDeleting ? displayText.length - 1 : displayText.length + 1));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <div className="view-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="view-title">System Overview</h1>

        {/* ── Intro card with depth ── */}
        <div className="overview-intro-card depth-hover">
          <div className="overview-header">
            <div style={{ position: 'relative' }}>
              <img
                src={portfolioData.profileImage}
                alt={portfolioData.name}
                className="profile-img"
              />
              <div className="identity-scan-bar" style={{ borderRadius: '50%' }} />
            </div>
            <div className="overview-title-section">
              <h2 className="overview-name">{portfolioData.name}</h2>
              <div style={{ height: '1.5rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '0.9rem' }}>
                {displayText}<span className="input-cursor" style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
              </div>
            </div>
          </div>
          <p className="bio-paragraph" style={{ marginBottom: '1.5rem' }}>{portfolioData.bio.split('\n\n')[0]}</p>
          <div style={{ padding: '1rem', borderLeft: '2px solid var(--accent)', background: 'var(--accent-dim)', borderRadius: '0 8px 8px 0' }}>
             <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text)' }}>
               "{portfolioData.personalStory}"
             </p>
          </div>
        </div>
      </motion.div>

      {/* ── Performance Metrics Dashboard ── */}
      <div className="section-label">Performance Metrics [LIVE]</div>
      <div className="snapshot-grid">
        {portfolioData.metrics.map((m, i) => (
          <motion.div 
            key={i} 
            className="snapshot-group depth-hover" 
            style={{ textAlign: 'center' }}
            whileHover={{ scale: 1.05, borderColor: 'var(--accent)' }}
          >
            <span className="snapshot-label" style={{ marginBottom: '0.2rem' }}>{m.label}</span>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>
              <AnimatedCounter value={m.value} suffix={m.suffix} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-label">Core Specializations</div>
      <div className="focus-areas-grid">
        {focusAreas.map((area, i) => (
          <motion.div 
            key={i} 
            className="focus-card depth-hover"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="focus-icon">{area.icon}</span>
            <h3 className="focus-title">{area.title}</h3>
            <p className="focus-desc">{area.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="section-label">Technical Proof</div>
      <div className="snapshot-grid">
        {portfolioData.skills.map((group, i) => (
          <div key={i} className="snapshot-group depth-hover">
            <span className="snapshot-label">{group.category}</span>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
               {group.items.slice(0, 3).map((item, j) => (
                 <li key={j} style={{ marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent)' }} />
                   {item}
                 </li>
               ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewView;
