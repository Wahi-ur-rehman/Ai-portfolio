import React from 'react';
import { portfolioData } from '../../../data/portfolioData';

const SkillsView: React.FC = () => {
  return (
    <div className="view-container">
      <h1 className="view-title">Capability Matrix</h1>
      
      <div className="skills-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {portfolioData.skills.map((skillGroup, idx) => (
          <div key={idx} className="skill-group-card depth-hover">
            <h3 className="skill-group-title">{skillGroup.category}</h3>
            <div className="skill-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {skillGroup.items.map((skill, sIdx) => (
                <div key={sIdx} className="skill-item-row" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <span style={{ color: 'var(--accent)', fontSize: '0.8rem' }}>•</span>
                  <span className="skill-proof" style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: '1.4' }}>
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsView;
